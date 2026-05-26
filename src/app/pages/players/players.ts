import { ChangeDetectionStrategy, Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../core/services/firebase';
import { Player } from '../../core/models/entities';
import { orderBy } from 'firebase/firestore';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <section class="bg-academy-blue py-20 text-white relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
           <img src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2000" class="w-full h-full object-cover" alt="Joueurs en action (arrière-plan)">
        </div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <h1 class="text-5xl font-display font-black uppercase italic tracking-tighter">Nos Joueurs</h1>
           <p class="text-academy-yellow font-display font-medium uppercase tracking-widest text-xs mt-2">La pépinière du football sénégalais</p>
        </div>
      </section>

      <!-- Grid -->
      <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <!-- Filters -->
          <div class="flex flex-wrap gap-4 mb-12">
            @for (cat of ['Tous', 'U13', 'U15', 'U17', 'Séniors']; track cat) {
              <button 
                (click)="selectedCategory.set(cat)"
                [class.bg-academy-blue]="selectedCategory() === cat"
                [class.text-white]="selectedCategory() === cat"
                [class.bg-white]="selectedCategory() !== cat"
                [class.text-academy-blue]="selectedCategory() !== cat"
                class="px-6 py-2 rounded-full font-display font-bold text-[10px] uppercase tracking-widest border border-gray-200 shadow-sm transition-all hover:scale-105"
              >
                {{ cat }}
              </button>
            }
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            @for (player of filteredPlayers(); track player.id) {
              <div class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div class="relative aspect-[3/4] overflow-hidden">
                  <img [src]="player.photoUrl || 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=800'" [alt]="'Photo de ' + player.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-academy-blue to-transparent">
                     <span class="text-academy-yellow font-display font-black text-2xl italic">#{{ player.age }}</span>
                  </div>
                </div>
                <div class="p-6 text-center">
                  <h3 class="text-xl font-display font-black text-academy-blue uppercase italic">{{ player.name }}</h3>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">{{ player.position }}</p>
                  
                  <div class="flex justify-center gap-6 border-t border-gray-50 pt-4">
                    <div class="flex flex-col">
                      <span class="text-sm font-display font-black text-academy-blue">{{ player.stats?.goals || 0 }}</span>
                      <span class="text-[8px] uppercase font-bold text-gray-400 tracking-widest">Buts</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-display font-black text-academy-blue">{{ player.stats?.assists || 0 }}</span>
                      <span class="text-[8px] uppercase font-bold text-gray-400 tracking-widest">Passes</span>
                    </div>
                  </div>
                </div>
              </div>
            } @empty {
               <div class="col-span-full py-20 text-center space-y-4">
                <span class="material-icons text-gray-200 text-6xl">person_off</span>
                <p class="text-gray-400 font-display font-bold italic uppercase tracking-widest">Aucun joueur dans cette catégorie</p>
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersComponent implements OnInit {
  private firebase = inject(FirebaseService);

  allPlayers = signal<Player[]>([]);
  selectedCategory = signal<string>('Tous');
  filteredPlayers = signal<Player[]>([]);

  constructor() {
    effect(() => {
      const cat = this.selectedCategory();
      const all = this.allPlayers();
      if (cat === 'Tous') {
        this.filteredPlayers.set(all);
      } else {
        this.filteredPlayers.set(all.filter((p: Player) => p.category === cat));
      }
    });
  }

  ngOnInit() {
    this.fetchPlayers();
  }

  private async fetchPlayers() {
    try {
      const data = await this.firebase.getCollection<Player>('players', [
        orderBy('name', 'asc')
      ]);
      if (data.length > 0) {
        this.allPlayers.set(data);
      } else {
        this.setMockPlayers();
      }
    } catch (e) {
      this.setMockPlayers();
    }
  }

  private setMockPlayers() {
    this.allPlayers.set([
      {
        id: 'mock1',
        name: 'Amadou Diallo',
        age: 16,
        category: 'U17',
        position: 'Attaquant',
        photoUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=400&h=500&fit=crop',
        stats: { goals: 12, assists: 4, matches: 15 }
      },
      {
        id: 'mock2',
        name: 'Cheikh Ndiaye',
        age: 14,
        category: 'U15',
        position: 'Milieu Terrain',
        photoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=400&h=500&fit=crop',
        stats: { goals: 3, assists: 10, matches: 18 }
      },
      {
        id: 'mock3',
        name: 'Moussa Sarr',
        age: 19,
        category: 'Séniors',
        position: 'Défenseur',
        photoUrl: 'https://images.unsplash.com/photo-1627627256606-cfaeb57e5e04?q=80&w=400&h=500&fit=crop',
        stats: { goals: 1, assists: 2, matches: 22 }
      },
      {
        id: 'mock4',
        name: 'Ibrahima Fall',
        age: 12,
        category: 'U13',
        position: 'Gardien',
        photoUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=400&h=500&fit=crop',
        stats: { goals: 0, assists: 1, matches: 12 }
      }
    ]);
  }
}
