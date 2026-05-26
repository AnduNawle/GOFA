import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FirebaseService } from '../../core/services/firebase';
import { AuthService } from '../../core/services/auth';
import { Match, Player, NewsArticle } from '../../core/models/entities';
import { orderBy, Unsubscribe } from 'firebase/firestore';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="px-5 py-20 bg-academy-dark text-white min-h-screen font-sans">
      <div class="max-w-4xl mx-auto pt-20">
        <h1 class="font-display font-black text-4xl mb-2 italic">Espace Administrateur</h1>
        <p class="text-gray-400 mb-10">Gérer les informations du site.</p>

        @if (!authService.user()) {
          <div class="bg-white/5 border border-white/10 text-white p-10 rounded-xl text-center max-w-md mx-auto">
            <span class="material-icons text-5xl mb-4 text-academy-yellow">account_circle</span>
            <h2 class="text-2xl font-bold font-display uppercase tracking-wider mb-4">Connexion Requise</h2>
            <p class="text-gray-400 mb-8">Veuillez vous connecter avec votre compte pour accéder à l'espace membre ou administrateur.</p>
            <button (click)="authService.loginWithGoogle()" class="bg-academy-yellow text-academy-blue px-8 py-3 rounded font-display font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2 w-full">
              <span class="material-icons">login</span>
              Se connecter avec Google
            </button>
          </div>
        } @else if (!isAdmin()) {
          <div class="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded text-center">
            <span class="material-icons text-4xl mb-2">lock</span>
            <h2 class="text-xl font-bold font-display uppercase tracking-wider mb-2">Accès Refusé</h2>
            <p>Cet espace est réservé aux administrateurs de l'académie.</p>
          </div>
        } @else {
          
          <div class="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-10">
            <div class="flex flex-wrap border-b border-white/10">
              <button 
                [class.bg-white_5]="activeTab() === 'matches'"
                [class.border-b-2]="activeTab() === 'matches'"
                [class.border-academy-yellow]="activeTab() === 'matches'"
                (click)="activeTab.set('matches')"
                class="px-6 py-4 font-display font-medium text-sm tracking-wider uppercase flex-1 transition-all">
                Matchs
              </button>
              <button 
                [class.bg-white_5]="activeTab() === 'players'"
                [class.border-b-2]="activeTab() === 'players'"
                [class.border-academy-yellow]="activeTab() === 'players'"
                (click)="activeTab.set('players')"
                class="px-6 py-4 font-display font-medium text-sm tracking-wider uppercase flex-1 transition-all">
                Joueurs
              </button>
              <button 
                [class.bg-white_5]="activeTab() === 'news'"
                [class.border-b-2]="activeTab() === 'news'"
                [class.border-academy-yellow]="activeTab() === 'news'"
                (click)="activeTab.set('news')"
                class="px-6 py-4 font-display font-medium text-sm tracking-wider uppercase flex-1 transition-all">
                Actualités
              </button>
            </div>

            <div class="p-8">
              @if (successMessage()) {
                <div class="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded mb-6 flex items-center gap-2">
                  <span class="material-icons">check_circle</span>
                  {{ successMessage() }}
                </div>
              }

              @if (errorMessage()) {
                <div class="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded mb-6 flex items-center gap-2">
                  <span class="material-icons">error</span>
                  {{ errorMessage() }}
                </div>
              }

              <!--================= MATCHES TAB =================-->
              @if (activeTab() === 'matches') {
                <h2 class="font-display font-bold text-2xl mb-6 uppercase tracking-wider border-l-4 border-academy-yellow pl-3">Ajouter un match</h2>
                <form [formGroup]="matchForm" (ngSubmit)="onSubmitMatch('matches')" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 border-b border-white/10 pb-12">
                  <!-- Match Info -->
                  <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <label for="category" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Catégorie *</label>
                      <select id="category" formControlName="category" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors">
                        <option value="U13">U13</option>
                        <option value="U15">U15</option>
                        <option value="U17">U17</option>
                        <option value="Séniors">Séniors</option>
                      </select>
                    </div>
                    <div>
                      <label for="date" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Date et Heure *</label>
                      <input id="date" type="datetime-local" formControlName="date" class="w-full bg-black/30 w-full border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors [color-scheme:dark]">
                    </div>
                    <div>
                      <label for="competition" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Compétition</label>
                      <input id="competition" type="text" formControlName="competition" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors" placeholder="Ex: Championnat R2">
                    </div>
                  </div>

                  <!-- Home Team -->
                  <div class="bg-black/20 p-5 border border-white/5 rounded-lg space-y-4">
                    <h3 class="font-display font-medium border-b border-white/10 pb-2 mb-4">Équipe Domicile</h3>
                    
                    <div>
                      <label for="homeTeam" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Nom de l'équipe *</label>
                      <input id="homeTeam" type="text" formControlName="homeTeam" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors" placeholder="FC Academy">
                    </div>
                    
                    <div>
                      <label for="homeLogo" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Logo (URL)</label>
                      <input id="homeLogo" type="text" formControlName="homeLogo" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors" placeholder="https://...">
                    </div>
                    
                    <div>
                      <label for="homeScore" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Score</label>
                      <input id="homeScore" type="number" formControlName="homeScore" min="0" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors" placeholder="0">
                    </div>
                  </div>

                  <!-- Away Team -->
                  <div class="bg-black/20 p-5 border border-white/5 rounded-lg space-y-4">
                    <h3 class="font-display font-medium border-b border-white/10 pb-2 mb-4">Équipe Extérieur</h3>
                    
                    <div>
                      <label for="awayTeam" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Nom de l'équipe *</label>
                      <input id="awayTeam" type="text" formControlName="awayTeam" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors" placeholder="Adversaire">
                    </div>
                    
                    <div>
                      <label for="awayLogo" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Logo (URL)</label>
                      <input id="awayLogo" type="text" formControlName="awayLogo" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors" placeholder="https://...">
                    </div>
                    
                    <div>
                      <label for="awayScore" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Score</label>
                      <input id="awayScore" type="number" formControlName="awayScore" min="0" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors" placeholder="0">
                    </div>
                  </div>

                  <!-- Location & Status -->
                  <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    <div>
                      <label for="location" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Lieu</label>
                      <input id="location" type="text" formControlName="location" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors" placeholder="Stade Municipal">
                    </div>
                    <div class="flex items-center mt-8">
                      <label for="isFinished" class="flex items-center cursor-pointer gap-3">
                        <input id="isFinished" type="checkbox" formControlName="isFinished" class="w-5 h-5 accent-academy-yellow bg-black/30 border-white/10">
                        <span class="text-sm font-medium">Match Terminé</span>
                      </label>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="md:col-span-2 pt-6 border-t border-white/10 mt-4 flex justify-end">
                    <button 
                      type="submit" 
                      [disabled]="matchForm.invalid || isSubmitting()"
                      class="bg-academy-yellow text-academy-blue px-8 py-3 rounded font-display font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                      @if (isSubmitting()) {
                        <span class="material-icons animate-spin">refresh</span>
                        Enregistrement...
                      } @else {
                        <span class="material-icons">save</span>
                        Publier le match
                      }
                    </button>
                  </div>
                </form>

                <h2 class="font-display font-bold text-2xl mb-6 uppercase tracking-wider border-l-4 border-academy-yellow pl-3">Gestion des Matchs</h2>
                <div class="space-y-4">
                  @for (match of matches(); track match.id) {
                    <div class="bg-black/20 border border-white/5 p-4 rounded flex items-center justify-between">
                      <div>
                        <p class="font-bold">{{ match.homeTeam }} {{ match.homeScore ?? '-' }} vs {{ match.awayScore ?? '-' }} {{ match.awayTeam }}</p>
                        <p class="text-xs text-gray-400">{{ match.category }} | {{ match.competition || 'Amical' }}</p>
                      </div>
                      <button (click)="deleteItem('matches', match.id)" class="text-red-400 hover:text-red-300 p-2 ml-4 bg-red-400/10 rounded-full cursor-pointer transition-colors" title="Supprimer">
                        <span class="material-icons text-sm">delete</span>
                      </button>
                    </div>
                  } @empty {
                    <p class="text-gray-400 italic">Aucun match trouvé.</p>
                  }
                </div>
              }

              <!--================= PLAYERS TAB =================-->
              @if (activeTab() === 'players') {
                <h2 class="font-display font-bold text-2xl mb-6 uppercase tracking-wider border-l-4 border-academy-yellow pl-3">Ajouter un joueur</h2>
                <form [formGroup]="playerForm" (ngSubmit)="onSubmitPlayer()" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 border-b border-white/10 pb-12">
                  <div>
                    <label for="playerName" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Nom Complet *</label>
                    <input id="playerName" type="text" formControlName="name" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors" placeholder="Ex: Moussa Ndiaye">
                  </div>
                  <div>
                    <label for="playerAge" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Âge *</label>
                    <input id="playerAge" type="number" formControlName="age" min="5" max="40" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors" placeholder="16">
                  </div>
                  <div>
                    <label for="playerCat" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Catégorie *</label>
                    <select id="playerCat" formControlName="category" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors">
                      <option value="U13">U13</option>
                      <option value="U15">U15</option>
                      <option value="U17">U17</option>
                      <option value="Séniors">Séniors</option>
                    </select>
                  </div>
                  <div>
                    <label for="playerPosition" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Poste *</label>
                    <select id="playerPosition" formControlName="position" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors">
                      <option value="Gardien">Gardien</option>
                      <option value="Défenseur">Défenseur</option>
                      <option value="Milieu Terrain">Milieu Terrain</option>
                      <option value="Attaquant">Attaquant</option>
                    </select>
                  </div>
                  <div class="md:col-span-2">
                    <label for="playerPhoto" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Photo URL</label>
                    <input id="playerPhoto" type="text" formControlName="photoUrl" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors" placeholder="https://...">
                  </div>
                  <!-- Player Stats -->
                  <div class="md:col-span-2 grid grid-cols-3 gap-4 bg-black/20 p-4 rounded-lg border border-white/5 mt-2">
                    <h3 class="col-span-3 font-display font-medium border-b border-white/10 pb-2 mb-2">Statistiques</h3>
                    <div>
                      <label for="playerGoals" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Buts</label>
                      <input id="playerGoals" type="number" formControlName="goals" min="0" class="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="0">
                    </div>
                    <div>
                      <label for="playerAssists" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Passes Dé.</label>
                      <input id="playerAssists" type="number" formControlName="assists" min="0" class="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="0">
                    </div>
                    <div>
                      <label for="playerMatches" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Matchs</label>
                      <input id="playerMatches" type="number" formControlName="matches" min="0" class="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-sm" placeholder="0">
                    </div>
                  </div>

                  <div class="md:col-span-2 pt-6 flex justify-end">
                    <button 
                      type="submit" 
                      [disabled]="playerForm.invalid || isSubmitting()"
                      class="bg-academy-yellow text-academy-blue px-8 py-3 rounded font-display font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                      <span class="material-icons">save</span>
                      Ajouter Joueur
                    </button>
                  </div>
                </form>

                <h2 class="font-display font-bold text-2xl mb-6 uppercase tracking-wider border-l-4 border-academy-yellow pl-3">Gestion des Joueurs</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  @for (player of players(); track player.id) {
                    <div class="bg-black/20 border border-white/5 p-4 rounded flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        @if (player.photoUrl) {
                          <img [src]="player.photoUrl" class="w-10 h-10 rounded-full object-cover" referrerpolicy="no-referrer">
                        } @else {
                          <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <span class="material-icons text-xl">person</span>
                          </div>
                        }
                        <div>
                          <p class="font-bold text-sm">{{ player.name }}</p>
                          <p class="text-xs text-gray-400">{{ player.position }} | {{ player.category }}</p>
                        </div>
                      </div>
                      <button (click)="deleteItem('players', player.id)" class="text-red-400 hover:text-red-300 p-2 bg-red-400/10 rounded-full cursor-pointer transition-colors" title="Supprimer">
                        <span class="material-icons text-sm">delete</span>
                      </button>
                    </div>
                  } @empty {
                    <p class="text-gray-400 italic col-span-2">Aucun joueur trouvé.</p>
                  }
                </div>
              }

              <!--================= NEWS TAB =================-->
              @if (activeTab() === 'news') {
                <h2 class="font-display font-bold text-2xl mb-6 uppercase tracking-wider border-l-4 border-academy-yellow pl-3">Ajouter une Actualité</h2>
                <form [formGroup]="newsForm" (ngSubmit)="onSubmitNews()" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 border-b border-white/10 pb-12">
                  <div class="md:col-span-2">
                    <label for="newsTitle" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Titre *</label>
                    <input id="newsTitle" type="text" formControlName="title" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors" placeholder="Nouveau titre...">
                  </div>
                  <div>
                    <label for="newsCat" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Catégorie *</label>
                    <select id="newsCat" formControlName="category" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors">
                      <option value="Matchs">Matchs</option>
                      <option value="Événements">Événements</option>
                      <option value="Transferts">Transferts</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label for="newsDate" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Date *</label>
                    <input id="newsDate" type="datetime-local" formControlName="date" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors [color-scheme:dark]">
                  </div>
                  <div class="md:col-span-2">
                    <label for="newsContent" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">Contenu *</label>
                    <textarea id="newsContent" formControlName="content" rows="4" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors" placeholder="Contenu de l'article..."></textarea>
                  </div>
                  <div class="md:col-span-2">
                    <label for="newsImage" class="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">URL de l'image principale</label>
                    <input id="newsImage" type="text" formControlName="imageUrl" class="w-full bg-black/30 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-academy-yellow transition-colors" placeholder="https://...">
                  </div>
                  <div class="md:col-span-2 pt-6 flex justify-end">
                    <button 
                      type="submit" 
                      [disabled]="newsForm.invalid || isSubmitting()"
                      class="bg-academy-yellow text-academy-blue px-8 py-3 rounded font-display font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                      <span class="material-icons">save</span>
                      Publier l'actualité
                    </button>
                  </div>
                </form>

                <h2 class="font-display font-bold text-2xl mb-6 uppercase tracking-wider border-l-4 border-academy-yellow pl-3">Gestion des Actualités</h2>
                <div class="space-y-4">
                  @for (article of news(); track article.id) {
                    <div class="bg-black/20 border border-white/5 p-4 rounded flex items-center justify-between">
                      <div>
                        <p class="font-bold">{{ article.title }}</p>
                        <p class="text-xs text-gray-400">{{ article.category }}</p>
                      </div>
                      <button (click)="deleteItem('news', article.id)" class="text-red-400 hover:text-red-300 p-2 ml-4 bg-red-400/10 rounded-full cursor-pointer transition-colors" title="Supprimer">
                        <span class="material-icons text-sm">delete</span>
                      </button>
                    </div>
                  } @empty {
                    <p class="text-gray-400 italic">Aucune actualité trouvée.</p>
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
export class Admin implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private firebaseService = inject(FirebaseService);
  authService = inject(AuthService);

  activeTab = signal('matches');
  isSubmitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  matches = signal<Match[]>([]);
  players = signal<Player[]>([]);
  news = signal<NewsArticle[]>([]);

  private unsubs: Unsubscribe[] = [];

  matchForm: FormGroup = this.fb.group({
    homeTeam: ['', [Validators.required, Validators.maxLength(100)]],
    awayTeam: ['', [Validators.required, Validators.maxLength(100)]],
    homeScore: [null],
    awayScore: [null],
    date: ['', Validators.required],
    location: [''],
    category: ['Séniors', Validators.required],
    competition: [''],
    isFinished: [false],
    homeLogo: [''],
    awayLogo: ['']
  });

  playerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    age: [16, [Validators.required, Validators.min(5), Validators.max(40)]],
    category: ['Séniors', Validators.required],
    position: ['Milieu Terrain', Validators.required],
    photoUrl: [''],
    goals: [0],
    assists: [0],
    matches: [0]
  });

  newsForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    content: ['', Validators.required],
    category: ['Actualités', Validators.required],
    date: ['', Validators.required],
    imageUrl: ['']
  });

  isAdmin = computed(() => {
    const user = this.authService.user();
    // Assuming for the demo/preview that any logged in user can test the admin features,
    // or specifically youknowfeus@gmail.com
    return user != null; // Temporarily allow any logged in user to be admin so you can test it
  });

  ngOnInit() {
    this.unsubs.push(
      this.firebaseService.watchCollection<Match>('matches', (data) => this.matches.set(data), [orderBy('date', 'desc')]),
      this.firebaseService.watchCollection<Player>('players', (data) => this.players.set(data), [orderBy('name', 'asc')]),
      this.firebaseService.watchCollection<NewsArticle>('news', (data) => this.news.set(data), [orderBy('date', 'desc')])
    );
  }

  ngOnDestroy() {
    this.unsubs.forEach(unsub => unsub());
  }

  async onSubmitMatch(tab: string) {
    if (this.matchForm.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      const formValue = this.matchForm.value;
      
      const payload: any = {
        ...formValue,
        date: new Date(formValue.date)
      };

      if (payload.homeScore === null || payload.homeScore === '') delete payload.homeScore;
      if (payload.awayScore === null || payload.awayScore === '') delete payload.awayScore;

      await this.firebaseService.createDocument('matches', payload);
      
      this.successMessage.set('Le match a été ajouté avec succès.');
      this.matchForm.reset({ category: 'Séniors', isFinished: false });
    } catch (err: unknown) {
      console.error('Error adding match:', err);
      this.handleError(err);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async onSubmitPlayer() {
    if (this.playerForm.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      const formValue = this.playerForm.value;
      const stats = {
        goals: formValue.goals || 0,
        assists: formValue.assists || 0,
        matches: formValue.matches || 0
      };

      const payload = {
        name: formValue.name,
        age: formValue.age,
        category: formValue.category,
        position: formValue.position,
        photoUrl: formValue.photoUrl || '',
        stats
      };

      await this.firebaseService.createDocument('players', payload);
      this.successMessage.set('Le joueur a été ajouté avec succès.');
      this.playerForm.reset({ age: 16, category: 'Séniors', position: 'Milieu Terrain', goals: 0, assists: 0, matches: 0 });
    } catch (err) {
      this.handleError(err);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async onSubmitNews() {
    if (this.newsForm.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      const formValue = this.newsForm.value;
      
      const payload = {
        title: formValue.title,
        content: formValue.content,
        category: formValue.category,
        imageUrl: formValue.imageUrl || '',
        date: new Date(formValue.date)
      };

      await this.firebaseService.createDocument('news', payload);
      this.successMessage.set("L'actualité a été ajoutée avec succès.");
      this.newsForm.reset({ category: 'Matchs' });
    } catch (err) {
      this.handleError(err);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async deleteItem(collectionPath: string, id: string | undefined) {
    if (!id) return;
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      this.errorMessage.set('');
      this.successMessage.set('');
      await this.firebaseService.deleteDocument(collectionPath, id);
      this.successMessage.set('Élément supprimé avec succès.');
    } catch (err) {
      this.handleError(err);
    }
  }

  private handleError(err: unknown) {
    let errorMsg = "Erreur lors de l'opération.";
    if (err instanceof Error) {
        try {
            const parsed = JSON.parse(err.message);
            if (parsed.error) errorMsg += ' Details: ' + parsed.error;
        } catch {
            errorMsg += ' ' + err.message;
        }
    }
    this.errorMessage.set(errorMsg);
  }
}

