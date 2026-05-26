import { ChangeDetectionStrategy, Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { FirebaseService } from '../../core/services/firebase';
import { where, orderBy } from 'firebase/firestore';

interface UserRegistration {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  position: string;
  parentPhone: string;
  parentEmail?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="py-24 bg-gray-50 min-h-screen">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Not logged in state -->
        @if (!authService.user()) {
          <div class="bg-white rounded-3xl shadow-xl p-8 md:p-16 text-center space-y-6 max-w-md mx-auto border border-gray-100 animate-in zoom-in duration-300">
            <div class="w-20 h-20 bg-amber-50 text-academy-yellow rounded-full flex items-center justify-center mx-auto">
              <span class="material-icons text-4xl">lock_outline</span>
            </div>
            <h1 class="text-3xl font-display font-black text-academy-blue uppercase italic leading-none">Accès Restreint</h1>
            <p class="text-gray-500 text-sm">Veuillez vous connecter avec votre compte Google pour accéder à votre espace personnel et suivre vos dossiers d'inscription.</p>
            <button 
              (click)="authService.loginWithGoogle()" 
              class="w-full bg-academy-yellow text-academy-blue py-4 rounded-xl font-display font-black uppercase tracking-[0.15em] text-xs hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span class="material-icons text-sm">login</span>
              Se connecter avec Google
            </button>
          </div>
        } @else {
          <!-- Logged in view -->
          <div class="space-y-10 animate-in fade-in slide-in-from-bottom duration-500">
            
            <!-- User Header Panel -->
            <div class="bg-gradient-to-br from-academy-blue to-academy-blue-light rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div class="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
              <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-academy-yellow/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div class="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div class="flex flex-col md:flex-row items-center gap-6">
                  <!-- Avatar -->
                  <div class="relative">
                    <img 
                      [src]="authService.user()?.photoURL || 'https://picsum.photos/seed/avatar/96/96'" 
                      alt="Avatar" 
                      class="w-24 h-24 rounded-full border-4 border-white/20 object-cover shadow-lg"
                      referrerpolicy="no-referrer"
                    />
                    <div class="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-academy-blue flex items-center justify-center">
                      <span class="w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
                    </div>
                  </div>
                  
                  <!-- Info -->
                  <div class="text-center md:text-left space-y-1">
                    <div class="flex items-center gap-2 justify-center md:justify-start">
                      <span class="bg-white/10 text-white uppercase font-display font-black text-[9px] tracking-widest px-3 py-1 rounded-full border border-white/5">
                        Membre Académie
                      </span>
                      @if (authService.user()?.email === 'youknowfeus@gmail.com') {
                        <span class="bg-academy-yellow text-academy-blue uppercase font-display font-black text-[9px] tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                          <span class="material-icons text-[10px]">shield</span> Admin
                        </span>
                      }
                    </div>
                    <h2 class="text-3xl font-display font-black tracking-tight uppercase italic text-academy-yellow">
                      {{ authService.user()?.displayName }}
                    </h2>
                    <p class="text-white/70 text-sm font-mono flex items-center gap-1.5 justify-center md:justify-start">
                      <span class="material-icons text-xs leading-none">email</span>
                      {{ authService.user()?.email }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  @if (authService.user()?.email === 'youknowfeus@gmail.com') {
                    <a 
                      routerLink="/admin"
                      class="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-widest border border-white/10 hover:border-white/20 transition-all flex items-center gap-2"
                    >
                      <span class="material-icons text-sm">dashboard</span> Admin Panel
                    </a>
                  }
                  <button 
                    (click)="authService.logout()" 
                    class="bg-academy-yellow text-academy-blue hover:bg-white px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <span class="material-icons text-sm">logout</span> Déconnecter
                  </button>
                </div>
              </div>
            </div>

            <!-- Dashboard Stats Grid -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                <span class="material-icons text-academy-blue/30 text-3xl">assignment</span>
                <p class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Total Dossiers</p>
                <p class="text-3xl font-display font-black text-academy-blue">{{ registrations().length }}</p>
              </div>
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                <span class="material-icons text-amber-500/30 text-3xl">pending_actions</span>
                <p class="text-[10px] font-black uppercase text-gray-400 tracking-wider">En examen</p>
                <p class="text-3xl font-display font-black text-amber-500">{{ pendingCount() }}</p>
              </div>
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                <span class="material-icons text-emerald-500/30 text-3xl">task_alt</span>
                <p class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Acceptés</p>
                <p class="text-3xl font-display font-black text-emerald-500">{{ acceptedCount() }}</p>
              </div>
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                <span class="material-icons text-red-500/30 text-3xl">cancel</span>
                <p class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Refusés / Autres</p>
                <p class="text-3xl font-display font-black text-red-500">{{ rejectedCount() }}</p>
              </div>
            </div>

            <!-- Applications Track list -->
            <div class="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-xl space-y-8">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                  <h3 class="text-xl font-display font-black text-academy-blue uppercase italic">Suivi des Inscriptions</h3>
                  <p class="text-xs text-gray-400 leading-normal mt-1">Consultez l'historique et l'avancement en temps réel de vos demandes scolastiques et sportives.</p>
                </div>
                <!-- Button to register a new child -->
                <a 
                  routerLink="/registration"
                  class="bg-academy-blue text-white px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-widest hover:bg-academy-blue-light hover:scale-105 active:scale-95 transition-all self-start sm:self-auto flex items-center gap-1.5"
                >
                  <span class="material-icons text-sm">add_circle_outline</span> Nouvelle Inscription
                </a>
              </div>

              <!-- Content Box -->
              @if (isLoading()) {
                <div class="py-16 text-center space-y-4">
                  <div class="w-10 h-10 border-4 border-academy-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Chargement de vos données...</p>
                </div>
              } @else if (registrations().length === 0) {
                <!-- Empty state -->
                <div class="py-16 text-center space-y-6 max-w-sm mx-auto">
                  <div class="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto">
                    <span class="material-icons text-3xl">no_accounts</span>
                  </div>
                  <div class="space-y-2">
                    <h4 class="text-base font-display font-bold text-academy-blue uppercase">Aucune inscription active</h4>
                    <p class="text-xs text-gray-400 leading-relaxed">Vous n'avez soumis aucune candidature d'élève ou de joueur pour la saison courante sous ce compte.</p>
                  </div>
                  <a 
                    routerLink="/registration"
                    class="inline-block bg-academy-yellow text-academy-blue px-6 py-3.5 rounded-xl font-display font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-md"
                  >
                    Inscrire un enfant maintenant
                  </a>
                </div>
              } @else {
                <!-- Active Registrations list -->
                <div class="divide-y divide-gray-100">
                  @for (reg of registrations(); track reg.id) {
                    <div class="py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors -mx-4 px-4 rounded-xl">
                      <div class="flex items-start gap-4">
                        <div class="w-12 h-12 bg-academy-blue/5 text-academy-blue rounded-xl flex items-center justify-center font-display font-black text-lg">
                          {{ reg.firstName[0] }}{{ reg.lastName[0] }}
                        </div>
                        <div class="space-y-1">
                          <h4 class="text-base font-bold text-academy-blue uppercase">
                            {{ reg.firstName }} {{ reg.lastName }}
                          </h4>
                          <div class="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-400 font-mono">
                            <span class="flex items-center gap-1">
                              <span class="material-icons text-xs">cake</span> 
                              Né(e) le: {{ reg.birthDate | date:'dd/MM/yyyy' : 'UTC' }}
                            </span>
                            <span class="flex items-center gap-1">
                              <span class="material-icons text-xs">sports_soccer</span> 
                              Poste: {{ reg.position }}
                            </span>
                            <span class="flex items-center gap-1">
                              <span class="material-icons text-xs">phone</span> 
                              {{ reg.parentPhone }}
                            </span>
                          </div>
                          <span class="block text-[10px] text-gray-400 font-mono mt-0.5">
                            Soumis le: {{ (reg.createdAt?.toDate ? reg.createdAt.toDate() : reg.createdAt) | date:'short' }}
                          </span>
                        </div>
                      </div>

                      <div class="flex items-center md:justify-end gap-3 self-start md:self-auto pl-16 md:pl-0">
                        <!-- Status Pill -->
                        <div class="shrink-0">
                          @switch (reg.status) {
                            @case ('pending') {
                              <span class="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-widest text-[9px] font-black px-3 py-1.5 rounded-full">
                                <span class="material-icons text-[10px] animate-pulse">sync</span> En examen
                              </span>
                            }
                            @case ('reviewed') {
                              <span class="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-widest text-[9px] font-black px-3 py-1.5 rounded-full">
                                <span class="material-icons text-[10px]">visibility</span> Examiné
                              </span>
                            }
                            @case ('accepted') {
                              <span class="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 uppercase tracking-widest text-[9px] font-black px-3 py-1.5 rounded-full">
                                <span class="material-icons text-[10px]">check_circle</span> Accepté
                              </span>
                            }
                            @case ('rejected') {
                              <span class="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 uppercase tracking-widest text-[9px] font-black px-3 py-1.5 rounded-full font-mono">
                                <span class="material-icons text-[10px]">cancel</span> Refusé
                              </span>
                            }
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

          </div>
        }

      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {
  authService = inject(AuthService);
  private firebaseService = inject(FirebaseService);

  registrations = signal<UserRegistration[]>([]);
  isLoading = signal(false);

  pendingCount = signal(0);
  acceptedCount = signal(0);
  rejectedCount = signal(0);

  constructor() {
    // Re-run registration query every time authorized user changes
    effect(() => {
      const currentUser = this.authService.user();
      if (currentUser) {
        this.loadUserRegistrations(currentUser.uid);
      } else {
        this.registrations.set([]);
        this.clearCounts();
      }
    });
  }

  private async loadUserRegistrations(userId: string) {
    this.isLoading.set(true);
    try {
      // Query registrations belonging to the current user
      const list = await this.firebaseService.getCollection<UserRegistration>('registrations', [
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      ]);
      this.registrations.set(list || []);
      this.calculateCounts(list || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      // Fallback request query if index is not ready yet without sorting
      try {
        const fallbackList = await this.firebaseService.getCollection<UserRegistration>('registrations', [
          where('userId', '==', userId)
        ]);
        // Sort manually by date on client side as fallback
        fallbackList.sort((a,b) => {
          const ad = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const bd = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return bd - ad;
        });
        this.registrations.set(fallbackList || []);
        this.calculateCounts(fallbackList || []);
      } catch (err) {
        console.error('Error fetching registration with fallback query:', err);
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  calculateCounts(list: UserRegistration[]) {
    let pending = 0;
    let accepted = 0;
    let rejected = 0;

    for (const item of list) {
      if (item.status === 'pending') {
        pending++;
      } else if (item.status === 'accepted') {
        accepted++;
      } else {
        rejected++;
      }
    }

    this.pendingCount.set(pending);
    this.acceptedCount.set(accepted);
    this.rejectedCount.set(rejected);
  }

  clearCounts() {
    this.pendingCount.set(0);
    this.acceptedCount.set(0);
    this.rejectedCount.set(0);
  }
}
