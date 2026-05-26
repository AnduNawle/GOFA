import { ChangeDetectionStrategy, Component, ElementRef, OnInit, signal, ViewChildren, QueryList, inject, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  visible: boolean;
}

@Component({
  selector: 'app-chasing-balls',
  standalone: true,
  imports: [CommonModule],
  template: `
    @for (ball of balls(); track ball.id) {
      <div 
        class="fixed z-50 rounded-full flex items-center justify-center cursor-pointer transition-opacity duration-1000"
        [class.opacity-0]="!ball.visible"
        [class.opacity-100]="ball.visible"
        [class.pointer-events-none]="!ball.visible"
        [style.left.px]="ball.x"
        [style.top.px]="ball.y"
        [style.width.px]="ball.size"
        [style.height.px]="ball.size"
        [style.transform]="'rotate(' + ball.rotation + 'deg)'"
        (click)="catchBall(ball.id)"
      >
        <span class="material-icons text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" [style.font-size.px]="ball.size * 0.8">sports_soccer</span>
      </div>
    }

    <!-- Celebration element when clicked -->
    @if (catchMessage()) {
      <div class="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-academy-yellow text-academy-blue font-display font-black italic uppercase px-6 py-3 rounded-full shadow-2xl animate-bounce tracking-widest text-sm pointer-events-none">
        {{ catchMessage() }}
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
      pointer-events: none;
    }
    .cursor-pointer {
      pointer-events: auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChasingBallsComponent implements OnInit, OnDestroy {
  private ngZone = inject(NgZone);
  private router = inject(Router);
  
  balls = signal<Ball[]>([]);
  catchMessage = signal<string | null>(null);
  
  private animationFrameId: number | null = null;
  private messageTimeout: any = null;
  private visibilityInterval: any = null;

  ngOnInit() {
    this.initBalls();
    
    // Periodically show/hide balls to make it a surprise
    this.visibilityInterval = setInterval(() => {
      this.randomizeVisibility();
    }, 15000); 

    // Re-randomize when navigating to make it feel like "which page will it appear on"
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.randomizeVisibility();
    });

    this.ngZone.runOutsideAngular(() => {
      this.gameLoop();
    });
  }

  ngOnDestroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    if (this.visibilityInterval) {
      clearInterval(this.visibilityInterval);
    }
  }

  private initBalls() {
    const defaultBalls: Ball[] = [
      { id: 1, x: -100, y: -100, vx: 3, vy: 2, size: 40, rotation: 0, rotationSpeed: 2, visible: false },
      { id: 2, x: -100, y: -100, vx: -2, vy: 4, size: 50, rotation: 0, rotationSpeed: -3, visible: false }
    ];
    this.balls.set(defaultBalls);
  }

  private randomizeVisibility() {
    if (typeof window === 'undefined') return;

    // 50% chance a ball appears on a page/interval
    this.balls.update(currentBalls => 
      currentBalls.map(ball => {
        const isVisible = Math.random() > 0.4;
        if (isVisible && !ball.visible) {
          // Reset position when appearing
          return {
            ...ball,
            visible: true,
            x: Math.random() * (window.innerWidth - ball.size),
            y: Math.random() * (window.innerHeight - ball.size - 100) + 50,
            vx: (Math.random() * 4 + 2) * (Math.random() > 0.5 ? 1 : -1),
            vy: (Math.random() * 4 + 2) * (Math.random() > 0.5 ? 1 : -1),
          };
        } else if (!isVisible && ball.visible) {
          // Hide it
          return { ...ball, visible: false };
        }
        return ball;
      })
    );
  }

  catchBall(id: number) {
    // When the user clicks the ball
    this.balls.update(currentBalls => 
      currentBalls.map(b => b.id === id ? { ...b, visible: false } : b)
    );
    
    this.catchMessage.set('⚽ Bien joué ! Ballon attrapé ! ⚽');
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    this.messageTimeout = setTimeout(() => {
      this.catchMessage.set(null);
    }, 3000);
  }

  private gameLoop() {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.balls.update(currentBalls => {
      let changed = false;
      const nextBalls = currentBalls.map(ball => {
        if (!ball.visible) return ball;
        
        changed = true;
        let nx = ball.x + ball.vx;
        let ny = ball.y + ball.vy;
        let nvx = ball.vx;
        let nvy = ball.vy;

        // Bounce off edges
        if (nx <= 0) {
          nx = 0;
          nvx = -nvx;
        } else if (nx + ball.size >= width) {
          nx = width - ball.size;
          nvx = -nvx;
        }

        if (ny <= 0) {
          ny = 0;
          nvy = -nvy;
        } else if (ny + ball.size >= height) {
          ny = height - ball.size;
          nvy = -nvy;
        }

        return {
          ...ball,
          x: nx,
          y: ny,
          vx: nvx,
          vy: nvy,
          rotation: (ball.rotation + ball.rotationSpeed) % 360
        };
      });
      return changed ? nextBalls : currentBalls;
    });

    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }
}
