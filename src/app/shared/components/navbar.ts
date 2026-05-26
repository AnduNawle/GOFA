import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-academy-blue text-white sticky top-0 z-50 shadow-xl border-b border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <!-- Logo & Brand -->
          <div class="flex items-center gap-3 cursor-pointer group" routerLink="/">
            <div class="relative">
              <img src="/images/gofalogo.jpg" alt="GOFA Logo" class="h-12 w-12 sm:h-14 sm:w-14 object-contain rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300" />
              <!-- Bouncing Ball -->
              <div class="absolute -bottom-1 -right-2 animate-soccer-ball">
                <span class="material-icons text-academy-yellow animate-soccer-ball-spin drop-shadow-[0_0_8px_rgba(255,255,0,0.5)] text-lg sm:text-xl">sports_soccer</span>
              </div>
            </div>
            <div class="flex flex-col">
              <span class="text-xl sm:text-2xl font-display font-black leading-none tracking-tight text-academy-yellow group-hover:text-white transition-colors">GOFA</span>
              <span class="text-[9px] sm:text-[10px] font-medium leading-tight uppercase tracking-wider opacity-80 max-w-[120px] sm:max-w-[150px] hidden xs:block">
                Golf Océan Football Academy Les Espadons
              </span>
            </div>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden lg:flex items-center gap-1 xl:gap-2">
            @for (item of menuItems(); track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="text-academy-yellow after:scale-x-100"
                class="px-2 xl:px-3 py-2 text-[11px] xl:text-xs font-bold uppercase tracking-widest hover:text-academy-yellow transition-all relative after:content-[''] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-academy-yellow after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                {{ item.label }}
              </a>
            }
          </div>

          <!-- Socials & CTAs (Desktop) -->
          <div class="hidden lg:flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
            <div class="flex gap-4 mr-2">
               <a href="#" class="text-white/70 hover:text-academy-yellow transition-colors"><i class="fa-brands fa-facebook-f text-sm"></i></a>
               <a href="#" class="text-white/70 hover:text-academy-yellow transition-colors"><i class="fa-brands fa-instagram text-sm"></i></a>
            </div>
            @if (authService.user()) {
              <a routerLink="/account" class="bg-academy-yellow text-academy-blue px-4 py-2 rounded-full font-display font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap">
                <span class="material-icons text-sm">account_circle</span>
                Mon Compte
              </a>
            } @else {
              <button (click)="handleMemberClick()" class="bg-academy-yellow text-academy-blue px-4 py-2 rounded-full font-display font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap">
                <span class="material-icons text-sm">person</span>
                Membre
              </button>
            }
          </div>
 
          <!-- Mobile Menu Button -->
          <div class="lg:hidden flex items-center gap-3">
            @if (authService.user()) {
              <a routerLink="/account" class="p-2 sm:p-2.5 rounded-full bg-white/10 text-academy-yellow hover:bg-white/20 transition-all border border-white/5 active:scale-90 flex items-center justify-center">
                <span class="material-icons text-xl">account_circle</span>
              </a>
            } @else {
              <button (click)="handleMemberClick()" class="p-2 sm:p-2.5 rounded-full bg-white/10 text-academy-yellow hover:bg-white/20 transition-all border border-white/5 active:scale-90 flex items-center justify-center">
                <span class="material-icons text-xl">person</span>
              </button>
            }
            <button (click)="isMenuOpen.set(!isMenuOpen())" class="p-2 sm:p-2.5 rounded-xl bg-academy-yellow text-academy-blue hover:scale-105 active:scale-90 transition-all shadow-lg">
              <span class="material-icons text-2xl">{{ isMenuOpen() ? 'close' : 'menu' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Overlay -->
      <div 
        class="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        [class.opacity-100]="isMenuOpen()"
        [class.opacity-0]="!isMenuOpen()"
        [class.pointer-events-none]="!isMenuOpen()"
        (click)="isMenuOpen.set(false)"
      ></div>

      <!-- Mobile Menu Drawer -->
      <div 
        class="lg:hidden fixed top-0 right-0 h-screen w-[280px] sm:w-[320px] bg-academy-blue z-50 shadow-2xl transition-transform duration-300 border-l border-white/5 overflow-y-auto"
        [class.translate-x-0]="isMenuOpen()"
        [class.translate-x-full]="!isMenuOpen()"
      >
        <div class="p-6 flex flex-col h-full">
          <div class="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
            <div class="flex items-center gap-2">
              <img src="/images/gofalogo.jpg" alt="Logo" class="h-8 w-8 object-contain rounded" />
              <span class="text-xl font-display font-black text-academy-yellow">MENU</span>
            </div>
            <button (click)="isMenuOpen.set(false)" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <span class="material-icons">close</span>
            </button>
          </div>

          <nav class="flex flex-col gap-2 flex-grow">
            @for (item of menuItems(); track item.path) {
              <a
                [routerLink]="item.path"
                (click)="isMenuOpen.set(false)"
                routerLinkActive="bg-academy-yellow text-academy-blue translate-x-2"
                class="flex items-center justify-between px-4 py-3.5 rounded-xl text-[13px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all duration-300"
              >
                {{ item.label }}
                <span class="material-icons text-xl opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all">chevron_right</span>
              </a>
            }
          </nav>

          <div class="mt-10 pt-6 border-t border-white/10">
            <div class="flex justify-center gap-8 mb-6 text-white/50">
              <a href="#" class="hover:text-academy-yellow transition-colors"><i class="fa-brands fa-facebook text-xl"></i></a>
              <a href="#" class="hover:text-academy-yellow transition-colors"><i class="fa-brands fa-instagram text-xl"></i></a>
              <a href="#" class="hover:text-academy-yellow transition-colors"><i class="fa-brands fa-youtube text-xl"></i></a>
            </div>
            <p class="text-[10px] text-center text-white/30 uppercase tracking-[0.2em]">
              © 2024 GOFA Academy
            </p>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host { display: block; }
    
    @keyframes bounce-ball {
      0%, 100% {
        transform: translateY(-8px);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }
      50% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }
    
    @keyframes spin-ball {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .animate-soccer-ball {
      display: inline-block;
      animation: bounce-ball 0.8s infinite;
    }
    
    .animate-soccer-ball-spin {
      display: inline-block;
      animation: spin-ball 3s linear infinite;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  authService = inject(AuthService);
  isMenuOpen = signal(false);
  
  private _baseMenuItems = [
    { label: 'Accueil', path: '/home' },
    { label: 'Matchs', path: '/matches' },
    { label: 'Joueurs', path: '/players' },
    { label: 'Académie', path: '/academy' },
    { label: 'Galerie', path: '/gallery' },
    { label: 'Classements', path: '/rankings' },
    { label: 'Transferts', path: '/transfers' },
    { label: 'Inscriptions', path: '/registration' },
    { label: 'Contact', path: '/contact' },
  ];

  menuItems = computed(() => {
    const user = this.authService.user();
    let currentItems = [...this._baseMenuItems];
    
    if (user) {
      currentItems = currentItems.filter(item => item.label !== 'Inscriptions');
      currentItems.push({ label: 'Mon Compte', path: '/account' });
      if (user.email === 'youknowfeus@gmail.com') {
        currentItems.push({ label: 'Admin', path: '/admin' });
      }
      return currentItems;
    }
    return currentItems;
  });

  async handleMemberClick() {
    const user = this.authService.user();
    if (user) {
      await this.authService.logout();
    } else {
      await this.authService.loginWithGoogle();
    }
  }
}
