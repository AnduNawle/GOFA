import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-academy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-white">
      <!-- Breadcrumb Header -->
      <section class="bg-academy-blue py-20 text-white relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
           <img src="https://images.unsplash.com/photo-1510133769068-6c17058e6584?q=80&w=2000" class="w-full h-full object-cover" alt="Arrière-plan stade">
        </div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 class="text-6xl font-display font-black uppercase italic tracking-tighter mb-4">L'Académie</h1>
          <p class="text-academy-yellow font-display font-bold uppercase tracking-[0.3em] text-xs">GOFA - Le talent se construit ici</p>
        </div>
      </section>

      <!-- Content -->
      <section class="py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-20 items-center mb-32">
            <div class="space-y-8">
              <div class="space-y-4">
                <h2 class="text- academy-blue text-xs font-black uppercase tracking-[0.4em] italic">Notre Histoire</h2>
                <h3 class="text-4xl font-display font-black text-academy-blue uppercase italic leading-tight">Forme les champions <span class="text-academy-yellow">de demain</span></h3>
              </div>
              <p class="text-gray-500 leading-relaxed text-lg">
                Fondée avec la vision de transformer le paysage du football au Sénégal, la Golf Océan Football Academy est devenue un centre d'excellence reconnu. Notre mission est de fournir un environnement professionnel où les jeunes talents peuvent s'épanouir techniquement, tactiquement et humainement.
              </p>
              <div class="grid grid-cols-2 gap-8 pt-4">
                <div class="border-l-4 border-academy-yellow pl-6">
                  <span class="block text-3xl font-display font-black text-academy-blue">2015</span>
                  <span class="text-[10px] uppercase font-bold tracking-widest text-gray-400">Année de création</span>
                </div>
                <div class="border-l-4 border-academy-yellow pl-6">
                  <span class="block text-3xl font-display font-black text-academy-blue">12+</span>
                  <span class="text-[10px] uppercase font-bold tracking-widest text-gray-400">Diplômes d'entraîneurs</span>
                </div>
              </div>
            </div>
            <div class="relative">
              <div class="absolute -inset-4 bg-academy-yellow/10 rounded-3xl -rotate-2 -z-10"></div>
              <img src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1000" class="rounded-3xl shadow-2xl w-full aspect-square object-cover" alt="Séance d'entraînement à l'académie">
            </div>
          </div>

          <!-- Pillars -->
          <div class="grid md:grid-cols-3 gap-12 mb-32">
             <div class="p-10 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group">
                <div class="w-16 h-16 bg-academy-blue text-academy-yellow rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span class="material-icons text-3xl">psychology</span>
                </div>
                <h4 class="text-xl font-display font-black text-academy-blue uppercase italic mb-4">Discipline</h4>
                <p class="text-sm text-gray-500 leading-relaxed">Le respect des règles et des horaires est la base de toute réussite durable.</p>
             </div>
             <div class="p-10 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group">
                <div class="w-16 h-16 bg-academy-blue text-academy-yellow rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span class="material-icons text-3xl">groups</span>
                </div>
                <h4 class="text-xl font-display font-black text-academy-blue uppercase italic mb-4">Solidarité</h4>
                <p class="text-sm text-gray-500 leading-relaxed">Une équipe soudée est plus forte que la somme de ses individualités.</p>
             </div>
             <div class="p-10 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group">
                <div class="w-16 h-16 bg-academy-blue text-academy-yellow rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span class="material-icons text-3xl">star</span>
                </div>
                <h4 class="text-xl font-display font-black text-academy-blue uppercase italic mb-4">Excellence</h4>
                <p class="text-sm text-gray-500 leading-relaxed">Nous visons le plus haut niveau dans chaque contrôle, chaque passe, chaque match.</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcademyComponent {}
