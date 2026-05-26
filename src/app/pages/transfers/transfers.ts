import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Transfer {
  id: string;
  playerName: string;
  playerRole: string;
  category: string;
  fromClub: string;
  toClub: string;
  type: 'in' | 'out';
  date: string;
  amount?: string;
  photoUrl: string;
}

@Component({
  selector: 'app-transfers',
  standalone: true,
  template: `
    <!-- Header Section -->
    <section class="relative bg-academy-blue text-white overflow-hidden pt-32 pb-24">
      <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518605368461-1e128224b456?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-academy-blue to-transparent"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span class="text-academy-yellow font-bold tracking-widest uppercase text-sm mb-4 block">Mercato & Évolution</span>
        <h1 class="text-5xl md:text-7xl font-display font-black italic uppercase tracking-tighter mb-6">
          Centre des <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Transferts</span>
        </h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto font-light">
          Suivez l'évolution de nos jeunes talents, les nouvelles recrues de l'académie et nos joueurs partis vers le monde professionnel.
        </p>
      </div>
    </section>

    <!-- Transfers List Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <!-- Arrivées (In) -->
          <div>
            <div class="flex items-center gap-4 mb-8 border-b border-gray-200 pb-4">
              <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <span class="material-icons">flight_land</span>
              </div>
              <h2 class="text-3xl font-display font-black uppercase tracking-widest text-gray-900 italic">Arrivées</h2>
            </div>
            
            <div class="space-y-6">
              @for (transfer of getTransfers('in'); track transfer.id) {
                <div class="bg-white rounded-3xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col sm:flex-row gap-6 items-center sm:items-start lg:items-center">
                  <div class="relative w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-gray-50 shadow-inner">
                    <img [src]="transfer.photoUrl" [alt]="transfer.playerName" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerpolicy="no-referrer" />
                  </div>
                  
                  <div class="flex-1 min-w-0 text-center sm:text-left">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <h3 class="text-xl font-display font-black text-gray-900 truncate">{{ transfer.playerName }}</h3>
                      <span class="text-xs font-bold px-3 py-1 bg-green-50 text-green-700 rounded-full w-fit mx-auto sm:mx-0 border border-green-100">{{ transfer.date }}</span>
                    </div>
                    <p class="text-sm text-gray-500 font-medium mb-3">{{ transfer.playerRole }} • {{ transfer.category }}</p>
                    
                    <div class="flex items-center justify-center sm:justify-start gap-3 text-sm">
                      <span class="font-bold text-gray-700 truncate max-w-[100px] xs:max-w-[120px]">{{ transfer.fromClub }}</span>
                      <span class="material-icons text-green-500 text-lg">arrow_right_alt</span>
                      <span class="font-bold text-academy-blue truncate max-w-[100px] xs:max-w-[120px]">{{ transfer.toClub }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Départs (Out) -->
          <div>
            <div class="flex items-center gap-4 mb-8 border-b border-gray-200 pb-4">
              <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-academy-blue">
                <span class="material-icons line-through">flight_takeoff</span>
              </div>
              <h2 class="text-3xl font-display font-black uppercase tracking-widest text-gray-900 italic">Départs PRO</h2>
            </div>
            
            <div class="space-y-6">
              @for (transfer of getTransfers('out'); track transfer.id) {
                <div class="bg-white rounded-3xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col sm:flex-row gap-6 items-center sm:items-start lg:items-center">
                  <div class="relative w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-gray-50 shadow-inner">
                    <img [src]="transfer.photoUrl" [alt]="transfer.playerName" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerpolicy="no-referrer" />
                    <div class="absolute inset-0 bg-academy-blue/10"></div>
                  </div>
                  
                  <div class="flex-1 min-w-0 text-center sm:text-left">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <h3 class="text-xl font-display font-black text-gray-900 truncate">{{ transfer.playerName }}</h3>
                      <span class="text-xs font-bold px-3 py-1 bg-blue-50 text-academy-blue rounded-full w-fit mx-auto sm:mx-0 border border-blue-100">{{ transfer.date }}</span>
                    </div>
                    <p class="text-sm text-gray-500 font-medium mb-3">{{ transfer.playerRole }} • {{ transfer.category }}</p>
                    
                    <div class="flex items-center justify-center sm:justify-start gap-3 text-sm">
                      <span class="font-bold text-academy-blue truncate max-w-[100px] xs:max-w-[120px]">{{ transfer.fromClub }}</span>
                      <span class="material-icons text-academy-blue text-lg">arrow_right_alt</span>
                      <span class="font-bold text-gray-700 truncate max-w-[100px] xs:max-w-[120px]">
                        {{ transfer.toClub }}
                        @if (transfer.amount) {
                          <span class="block text-[10px] text-green-600 uppercase">{{ transfer.amount }}</span>
                        }
                      </span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransfersComponent {
  transfers: Transfer[] = [
    {
      id: 't1',
      playerName: 'Moussa Diagne',
      playerRole: 'Milieu offensif',
      category: 'U19',
      fromClub: 'GOFA',
      toClub: 'FC Metz B',
      type: 'out',
      date: 'Juil. 2023',
      amount: 'Transfert pro',
      photoUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=400&fit=crop'
    },
    {
      id: 't2',
      playerName: 'Amadou Sarr',
      playerRole: 'Défenseur central',
      category: 'U17',
      fromClub: 'AS Pikine',
      toClub: 'GOFA',
      type: 'in',
      date: 'Août 2023',
      photoUrl: 'https://images.unsplash.com/photo-1510566337590-2fc1f21100ce?q=80&w=400&fit=crop'
    },
    {
      id: 't3',
      playerName: 'Issa Ndoye',
      playerRole: 'Attaquant',
      category: 'U19',
      fromClub: 'GOFA',
      toClub: 'Génération Foot',
      type: 'out',
      date: 'Janv. 2024',
      amount: 'Partenariat',
      photoUrl: 'https://images.unsplash.com/photo-1522778526582-1e5b12da6f4e?q=80&w=400&fit=crop'
    },
    {
      id: 't4',
      playerName: 'Cheikh Fall',
      playerRole: 'Gardien de but',
      category: 'U15',
      fromClub: 'Dakar SC',
      toClub: 'GOFA',
      type: 'in',
      date: 'Fév. 2024',
      photoUrl: 'https://images.unsplash.com/photo-1431324155629-1a5bb018cc16?q=80&w=400&fit=crop'
    },
    {
      id: 't5',
      playerName: 'Omar Ba',
      playerRole: 'Ailier droit',
      category: 'U19',
      fromClub: 'GOFA',
      toClub: 'Amiens SC U19',
      type: 'out',
      date: 'Juin 2024',
      amount: 'Transfert pro',
      photoUrl: 'https://images.unsplash.com/photo-1486286701208-1ebf41d05abb?q=80&w=400&fit=crop'
    }
  ];

  getTransfers(type: 'in' | 'out') {
    return this.transfers.filter(t => t.type === type);
  }
}
