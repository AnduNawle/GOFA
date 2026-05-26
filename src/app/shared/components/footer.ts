import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-academy-blue text-white pt-16 pb-8 border-t border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <!-- About -->
          <div class="space-y-6">
            <div class="flex items-center gap-3">
              <img src="images/gofalogo.jpg" alt="GOFA Logo" class="h-16 w-16 grayscale brightness-200" />
              <div class="flex flex-col">
                <span class="text-2xl font-display font-black text-white">GOFA</span>
                <span class="text-[10px] uppercase tracking-widest opacity-60">Le talent se construit ici</span>
              </div>
            </div>
            <p class="text-sm text-white/60 leading-relaxed max-w-xs">
              La Golf Océan Football Academy est dédiée à la détection et à la formation des futurs talents du football sénégalais et international.
            </p>
            <div class="flex items-center gap-4">
               <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-academy-yellow hover:text-academy-blue transition-all"><i class="fa-brands fa-facebook-f"></i></a>
               <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-academy-yellow hover:text-academy-blue transition-all"><i class="fa-brands fa-instagram"></i></a>
               <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-academy-yellow hover:text-academy-blue transition-all"><i class="fa-brands fa-youtube"></i></a>
            </div>
          </div>

          <!-- Links 1 -->
          <div>
            <h3 class="text-academy-yellow font-display font-bold text-sm uppercase tracking-widest mb-6">Liens Rapides</h3>
            <ul class="space-y-4">
              <li><a href="#" class="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block">Accueil</a></li>
              <li><a href="#" class="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block">Matchs</a></li>
              <li><a href="#" class="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block">Joueurs</a></li>
              <li><a href="#" class="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block">Académie</a></li>
              <li><a href="#" class="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block">Galerie</a></li>
            </ul>
          </div>

          <!-- Links 2 -->
          <div>
            <h3 class="text-academy-yellow font-display font-bold text-sm uppercase tracking-widest mb-6">Autre</h3>
            <ul class="space-y-4">
              <li><a href="#" class="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block">Classements</a></li>
              <li><a href="#" class="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block">Transferts</a></li>
              <li><a href="#" class="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block">Inscriptions</a></li>
              <li><a href="#" class="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all inline-block">Contact</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h3 class="text-academy-yellow font-display font-bold text-sm uppercase tracking-widest mb-6">Contact</h3>
            <ul class="space-y-5">
              <li class="flex gap-4">
                <span class="material-icons text-academy-yellow text-sm">phone</span>
                <span class="text-sm text-white/70">78 129 27 91</span>
              </li>
              <li class="flex gap-4">
                <span class="material-icons text-academy-yellow text-sm">email</span>
                <span class="text-sm text-white/70">cheikhdiene125&#64;gmail.com</span>
              </li>
              <li class="flex gap-4">
                <span class="material-icons text-academy-yellow text-sm">location_on</span>
                <span class="text-sm text-white/70">Mbour - Sénégal</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 uppercase tracking-widest">
          <p>© 2026 GOFA ACADEMY. TOUS DROITS RÉSERVÉS.</p>
          <p>DÉVELOPPÉ PAR AIS BUILD</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
