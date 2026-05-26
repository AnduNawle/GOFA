import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../core/services/firebase';
import { Match } from '../../core/models/entities';
import { orderBy } from 'firebase/firestore';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <section class="bg-academy-blue py-20 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h1 class="text-5xl font-display font-black uppercase italic tracking-tighter">Matchs & Résultats</h1>
           <p class="text-academy-yellow font-display font-medium uppercase tracking-widest text-xs mt-2">Suivez le parcours de nos équipes</p>
        </div>
      </section>

      <!-- Matches Grid -->
      <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Filters (Mock) -->
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

          <div class="space-y-8">
            @for (match of filteredMatches(); track match.id) {
              <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                
                <!-- Match Header -->
                <div class="bg-gray-50 px-8 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div class="flex items-center gap-3">
                    <span class="inline-flex items-center justify-center px-4 py-1.5 bg-academy-blue text-academy-yellow font-display font-black text-[10px] uppercase tracking-widest rounded-full shadow-sm">
                      {{ match.category }}
                    </span>
                    <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">{{ match.competition || 'Amical' }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-gray-400 text-xs font-medium uppercase tracking-widest">
                    <span class="material-icons text-[14px]">event</span>
                    {{ match.date?.toDate() | date:'dd MMM yyyy - HH:mm' }}
                  </div>
                </div>

                <div class="grid md:grid-cols-5 items-center p-8 md:p-12 gap-8 relative">
                  
                  <!-- Home Team -->
                  <div class="md:col-span-2 flex flex-col items-center gap-6">
                    <div class="relative group">
                      <div class="absolute inset-0 bg-academy-blue rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <div class="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center p-4 shadow-lg border border-gray-50 relative z-10">
                        <img [src]="match.homeLogo || 'images/gofalogo.jpg'" class="w-full h-full object-contain drop-shadow-md" [alt]="match.homeTeam" referrerpolicy="no-referrer">
                      </div>
                    </div>
                    <span class="text-sm md:text-lg font-display font-black uppercase tracking-widest text-center text-gray-900">{{ match.homeTeam }}</span>
                  </div>

                  <!-- Score / Status -->
                  <div class="md:col-span-1 flex flex-col items-center justify-center gap-4 relative z-10 w-full py-4 md:py-0">
                    @if (match.isFinished) {
                      <div class="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-inner flex flex-col items-center min-w-[140px]">
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Terminé</span>
                        <div class="text-5xl md:text-6xl font-display font-black text-academy-blue italic flex items-center gap-4">
                          <span [class.text-academy-yellow]="(match.homeScore ?? 0) > (match.awayScore ?? 0)">{{ match.homeScore }}</span>
                          <span class="text-gray-300 text-3xl">-</span>
                          <span [class.text-academy-yellow]="(match.awayScore ?? 0) > (match.homeScore ?? 0)">{{ match.awayScore }}</span>
                        </div>
                      </div>
                    } @else {
                      <div class="flex flex-col items-center gap-3">
                        <div class="w-16 h-16 rounded-full bg-academy-yellow/10 flex items-center justify-center border border-academy-yellow/20">
                          <span class="material-icons text-academy-yellow text-3xl animate-pulse">schedule</span>
                        </div>
                        <div class="px-6 py-2 bg-academy-yellow text-academy-blue font-display font-black text-[10px] uppercase tracking-widest rounded-full shadow-sm italic">
                          À Venir
                        </div>
                      </div>
                    }
                  </div>

                  <!-- Away Team -->
                  <div class="md:col-span-2 flex flex-col items-center gap-6">
                    <div class="relative group">
                      <div class="absolute inset-0 bg-red-500 rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <div class="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center p-4 shadow-lg border border-gray-50 relative z-10">
                        <img [src]="match.awayLogo || 'https://firebasestorage.googleapis.com/v0/b/gofa-academy.appspot.com/o/assets%2Flogo_opp.png?alt=media'" class="w-full h-full object-contain drop-shadow-md" [alt]="match.awayTeam" referrerpolicy="no-referrer">
                      </div>
                    </div>
                    <span class="text-sm md:text-lg font-display font-black uppercase tracking-widest text-center text-gray-900">{{ match.awayTeam }}</span>
                  </div>

                  <!-- VS Background Graphic -->
                  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[150px] font-display font-black italic text-gray-50 opacity-50 z-0 pointer-events-none select-none">
                    VS
                  </div>
                </div>

                <!-- Match Footer (Location) -->
                @if (match.location) {
                  <div class="bg-gray-50/50 px-8 py-4 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                    <span class="material-icons text-sm text-academy-blue">location_on</span>
                    {{ match.location }}
                  </div>
                }
              </div>
            } @empty {
              <div class="py-20 text-center space-y-4">
                <span class="material-icons text-gray-200 text-6xl">sports_soccer</span>
                <p class="text-gray-400 font-display font-bold italic uppercase tracking-widest">Aucun match trouvé</p>
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchesComponent implements OnInit {
  private firebase = inject(FirebaseService);

  allMatches = signal<Match[]>([]);
  selectedCategory = signal<string>('Tous');
  filteredMatches = signal<Match[]>([]);

  constructor() {
    effect(() => {
      const cat = this.selectedCategory();
      const all = this.allMatches();
      if (cat === 'Tous') {
        this.filteredMatches.set(all);
      } else {
        this.filteredMatches.set(all.filter(m => m.category === cat));
      }
    });
  }

  ngOnInit() {
    this.fetchMatches();
  }

  private async fetchMatches() {
    try {
      const data = await this.firebase.getCollection<Match>('matches', [
        orderBy('date', 'desc')
      ]);
      if (data.length > 0) {
        this.allMatches.set(data);
      } else {
        this.setMockMatches();
      }
    } catch (e) {
      this.setMockMatches();
    }
  }

  private setMockMatches() {
    const mockDate1 = new Date();
    mockDate1.setDate(mockDate1.getDate() - 2);
    const mockDate2 = new Date();
    mockDate2.setDate(mockDate2.getDate() + 5);

    this.allMatches.set([
      {
        id: 'mock1',
        homeTeam: 'Golf Océan Academy',
        awayTeam: 'Dakar Sacré-Cœur',
        category: 'U17',
        competition: 'Ligue Régionale U17',
        date: { toDate: () => mockDate1 } as any,
        isFinished: true,
        homeScore: 2,
        awayScore: 1,
        homeLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=GO&backgroundColor=004481&textColor=ffffff',
        awayLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=DSC&backgroundColor=dddddd&textColor=000000',
        location: 'Stade Municipal'
      },
      {
        id: 'mock2',
        homeTeam: 'Golf Océan Academy',
        awayTeam: 'Génération Foot',
        category: 'U15',
        competition: 'Coupe du Sénégal Jeunes',
        date: { toDate: () => mockDate2 } as any,
        isFinished: false,
        homeScore: undefined,
        awayScore: undefined,
        homeLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=GO&backgroundColor=004481&textColor=ffffff',
        awayLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=GF&backgroundColor=e63946&textColor=ffffff',
        location: 'Déni Birame Ndao'
      },
      {
        id: 'mock3',
        homeTeam: 'AS Pikine',
        awayTeam: 'Golf Océan Academy',
        category: 'Séniors',
        competition: 'Championnat R2',
        date: { toDate: () => { const d = new Date(); d.setDate(d.getDate() - 7); return d; } } as any,
        isFinished: true,
        homeScore: 0,
        awayScore: 3,
        homeLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=ASP&backgroundColor=2a9d8f&textColor=ffffff',
        awayLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=GO&backgroundColor=004481&textColor=ffffff',
        location: 'Stade Alassane Djigo'
      }
    ]);
  }
}
