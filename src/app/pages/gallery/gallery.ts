import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-white">
      <section class="bg-academy-blue py-20 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h1 class="text-5xl font-display font-black uppercase italic tracking-tighter">Galerie</h1>
           <p class="text-academy-yellow font-display font-medium uppercase tracking-widest text-xs mt-2">Moments forts & Immersion</p>
        </div>
      </section>

      <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (img of images; track $index) {
              <div class="group relative aspect-square rounded-3xl overflow-hidden shadow-xl cursor-pointer">
                <img [src]="img.url" [alt]="img.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerpolicy="no-referrer" />
                <div class="absolute inset-0 bg-gradient-to-tr from-academy-blue/90 via-academy-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                   <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                     <span class="text-academy-yellow text-xs font-bold uppercase tracking-widest mb-1 block">{{ img.category }}</span>
                     <h3 class="text-white font-display font-black text-2xl italic leading-tight">{{ img.title }}</h3>
                   </div>
                </div>
                <div class="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                  <div class="bg-white/20 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center text-white border border-white/20">
                    <span class="material-icons">search</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent {
  images = [
    { url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop', title: "Terrain d'honneur", category: 'Infrastructures' },
    { url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=800&auto=format&fit=crop', title: 'Dribble explosif', category: 'Action' },
    { url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop', title: "Célébration d'équipe", category: 'Victoire' },
    { url: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=800&auto=format&fit=crop', title: 'Académie des jeunes', category: 'Formation' },
    { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop', title: 'Séance sous les projecteurs', category: 'Entraînement' },
    { url: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800&auto=format&fit=crop', title: 'Préparation physique', category: 'Entraînement' },
    { url: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop', title: 'Le but décisif', category: 'Match' },
    { url: 'https://images.unsplash.com/photo-1504305754058-2f08ccd89a0a?q=80&w=800&auto=format&fit=crop', title: 'Arrêt spectaculaire', category: 'Action' },
    { url: 'https://images.unsplash.com/photo-1516567727145-ab3c1a391514?q=80&w=800&auto=format&fit=crop', title: "Esprit d'équipe", category: 'Valeurs' }
  ];
}
