import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 class="text-9xl font-display font-black text-academy-blue opacity-10">404</h1>
      <div class="relative -mt-20 space-y-6">
        <h2 class="text-4xl font-display font-black uppercase text-academy-blue italic">Page non trouvée</h2>
        <p class="text-gray-500 max-w-md mx-auto">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
        <button routerLink="/home" class="bg-academy-yellow text-academy-blue px-8 py-4 rounded-md font-display font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-xl inline-flex items-center gap-3">
          Retour à l'accueil
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
