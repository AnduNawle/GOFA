import { ChangeDetectionStrategy, Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { FirebaseService } from '../../core/services/firebase';
import { Preferences } from '../../core/services/preferences';
import { where, orderBy, doc, setDoc } from 'firebase/firestore';
import { db } from '../../core/firebase-init';

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
                      {{ profileDisplayName() || authService.user()?.displayName }}
                    </h2>
                    <p class="text-white/70 text-sm font-mono flex items-center gap-1.5 justify-center md:justify-start">
                      <span class="material-icons text-xs leading-none">email</span>
                      {{ authService.user()?.email }}
                    </p>
                  </div>
                </div>

                <div class="flex flex-wrap items-center justify-center md:justify-end gap-3 shrink-0">
                  <button 
                    (click)="activeTab.set(activeTab() === 'profile' ? 'records' : 'profile')" 
                    class="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-widest border border-white/10 hover:border-white/20 transition-all flex items-center gap-2"
                  >
                    <span class="material-icons text-sm">{{ activeTab() === 'profile' ? 'assignment' : 'person' }}</span>
                    {{ activeTab() === 'profile' ? 'Mes dossiers' : 'Mon Profil' }}
                  </button>
                  
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

            <!-- Central Navigation Tabs -->
            <div class="flex flex-wrap justify-center sm:justify-start gap-2 border-b border-gray-200/50 pb-1">
              <button 
                (click)="activeTab.set('records')"
                class="px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 border cursor-pointer"
                [class.bg-academy-blue]="activeTab() === 'records'"
                [class.text-white]="activeTab() === 'records'"
                [class.border-academy-blue]="activeTab() === 'records'"
                [class.bg-white]="activeTab() !== 'records'"
                [class.text-academy-blue]="activeTab() !== 'records'"
                [class.border-gray-200/60]="activeTab() !== 'records'"
                [class.hover:bg-gray-50]="activeTab() !== 'records'"
              >
                <span class="material-icons text-sm">assignment</span>
                Dossiers
              </button>

              <button 
                (click)="activeTab.set('profile')"
                class="px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 border cursor-pointer"
                [class.bg-academy-blue]="activeTab() === 'profile'"
                [class.text-white]="activeTab() === 'profile'"
                [class.border-academy-blue]="activeTab() === 'profile'"
                [class.bg-white]="activeTab() !== 'profile'"
                [class.text-academy-blue]="activeTab() !== 'profile'"
                [class.border-gray-200/60]="activeTab() !== 'profile'"
                [class.hover:bg-gray-50]="activeTab() !== 'profile'"
              >
                <span class="material-icons text-sm">person</span>
                Mon Profil
              </button>

              <button 
                (click)="activeTab.set('settings')"
                class="px-5 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 border cursor-pointer"
                [class.bg-academy-blue]="activeTab() === 'settings'"
                [class.text-white]="activeTab() === 'settings'"
                [class.border-academy-blue]="activeTab() === 'settings'"
                [class.bg-white]="activeTab() !== 'settings'"
                [class.text-academy-blue]="activeTab() !== 'settings'"
                [class.border-gray-200/60]="activeTab() !== 'settings'"
                [class.hover:bg-gray-50]="activeTab() !== 'settings'"
              >
                <span class="material-icons text-sm">settings</span>
                Réglages
              </button>
            </div>

            @if (activeTab() === 'records') {
              <!-- Applications Track list -->
              <div class="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-xl space-y-8 animate-in fade-in duration-300">
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
                  <div class="divide-y divide-gray-100" [class.max-h-[300px]]="prefCompactMode()" [class.overflow-y-auto]="prefCompactMode()">
                    @for (reg of registrations(); track reg.id) {
                      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors -mx-4 px-4 rounded-xl"
                           [class.py-3="prefCompactMode()"] [class.py-6="!prefCompactMode()"]>
                        <div class="flex items-start gap-4">
                          <div class="bg-academy-blue/5 text-academy-blue rounded-xl flex items-center justify-center font-display font-black"
                               [class.w-9.h-9.text-sm="prefCompactMode()"] [class.w-12.h-12.text-lg="!prefCompactMode()"]>
                            {{ reg.firstName[0] }}{{ reg.lastName[0] }}
                          </div>
                          <div class="space-y-1">
                            <h4 class="font-bold text-academy-blue uppercase" [class.text-sm="prefCompactMode()"] [class.text-base="!prefCompactMode()"]>
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
            } @else if (activeTab() === 'settings') {
              <!-- Settings Section - High-quality Custom UI -->
              <div class="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-xl space-y-8 animate-in fade-in slide-in-from-right duration-300">
                <div class="border-b border-gray-100 pb-6 flex items-center justify-between gap-4">
                  <div>
                    <h3 class="text-xl font-display font-black text-academy-blue uppercase italic">Paramètres & Personnalisation</h3>
                    <p class="text-xs text-gray-400 leading-normal mt-1">Gérez vos options d'affichage, préférences de poste et notifications de statut.</p>
                  </div>
                  <span class="material-icons text-academy-blue/20 text-4xl hidden sm:block">settings</span>
                </div>

                @if (settingsSaved()) {
                  <div class="p-4 bg-green-50/80 border border-green-200/50 text-green-800 rounded-2xl flex items-center gap-3 animate-in fade-in duration-300">
                    <span class="material-icons text-green-600">check_circle</span>
                    <p class="text-xs font-bold uppercase tracking-widest">Vos préférences ont été enregistrées avec succès !</p>
                  </div>
                }

                <div class="grid md:grid-cols-2 gap-8">
                  <!-- Account Information & Display Options -->
                  <div class="space-y-6">
                    <div>
                      <h4 class="text-xs font-black uppercase text-academy-blue tracking-wider flex items-center gap-2 mb-4">
                        <span class="material-icons text-sm">contact_mail</span> Coordonnées du Compte
                      </h4>
                      
                      <!-- Prominent Email display as requested by the user -->
                      <div class="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                        <div class="space-y-1">
                          <p class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Identifiant de connexion</p>
                          <div class="flex items-center gap-2">
                            <span class="material-icons text-emerald-500 text-lg">verified_user</span>
                            <span class="text-sm font-mono font-bold text-gray-800">{{ authService.user()?.email }}</span>
                          </div>
                          <span class="block text-[10px] text-gray-400 font-sans">
                            Vos alertes d'avancement d'inscription seront envoyées à cette adresse mail.
                          </span>
                        </div>
                        
                        <div class="space-y-1 pt-1">
                          <p class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Nom complet de l'utilisateur</p>
                          <p class="text-xs font-bold text-gray-700 font-sans">
                            {{ authService.user()?.displayName }}
                          </p>
                        </div>

                        <div class="space-y-1 pt-1">
                          <p class="text-[10px] font-black uppercase text-gray-400 tracking-wider">Méthode de connexion sécurisée</p>
                          <p class="text-xs text-gray-500 font-mono flex items-center gap-1.5">
                            <span class="material-icons text-amber-500 text-sm">security</span>
                            Google Identity Service
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="space-y-4">
                      <h4 class="text-xs font-black uppercase text-academy-blue tracking-wider flex items-center gap-2">
                        <span class="material-icons text-sm">tune</span> Préférences d'Affichage
                      </h4>

                      <div class="space-y-3">
                        <label class="flex items-center justify-between p-3.5 bg-gray-50/50 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-100">
                          <div>
                            <p class="text-xs font-bold text-gray-800 uppercase tracking-wide">Mode de liste compact</p>
                            <p class="text-[10px] text-gray-400">Réduit la hauteur des dossiers d'inscription</p>
                          </div>
                          <input 
                            type="checkbox" 
                            [checked]="prefCompactMode()" 
                            (change)="toggleCompactMode()"
                            class="w-5 h-5 accent-academy-blue rounded cursor-pointer"
                          />
                        </label>

                        <label class="flex items-center justify-between p-3.5 bg-gray-50/50 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-100">
                          <div>
                            <p class="text-xs font-bold text-gray-800 uppercase tracking-wide">Langue préférée</p>
                            <p class="text-[10px] text-gray-400">Choisir la langue d'affichage du portail</p>
                          </div>
                          <select 
                            [value]="prefLanguage()" 
                            (change)="changeLanguage($any($event.target).value)"
                            class="text-xs font-bold text-academy-blue bg-white border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:border-academy-blue"
                          >
                            <option value="fr">Français (FR)</option>
                            <option value="en">English (EN)</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Personalization Preferences -->
                  <div class="space-y-6">
                    <h4 class="text-xs font-black uppercase text-academy-blue tracking-wider flex items-center gap-2">
                      <span class="material-icons text-sm">notifications</span> Notifications & Alertes
                    </h4>

                    <div class="space-y-3">
                      <label class="flex items-start justify-between p-3.5 bg-gray-50/50 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-100">
                        <div class="space-y-0.5">
                          <p class="text-xs font-bold text-gray-800 uppercase tracking-wide">Alertes de statut en temps réel</p>
                          <p class="text-[10px] text-gray-400 leading-relaxed">Suivre les changements d'inscription par mail immédiat.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          [checked]="prefEmailAlerts()" 
                          (change)="toggleEmailAlerts()"
                          class="w-5 h-5 accent-academy-blue rounded cursor-pointer mt-0.5"
                        />
                      </label>

                      <label class="flex items-start justify-between p-3.5 bg-gray-50/50 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-100">
                        <div class="space-y-0.5">
                          <p class="text-xs font-bold text-gray-800 uppercase tracking-wide">Notifications SMS complémentaires</p>
                          <p class="text-[10px] text-gray-400 leading-relaxed">Recevoir des rappels SMS d'événements et de convocations.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          [checked]="prefSmsAlerts()" 
                          (change)="toggleSmsAlerts()"
                          class="w-5 h-5 accent-academy-blue rounded cursor-pointer mt-0.5"
                        />
                      </label>

                      <div class="p-3.5 bg-gray-50/50 rounded-xl border border-gray-100 space-y-2">
                        <p class="text-xs font-bold text-gray-800 uppercase tracking-wide">Rapports d'actualité de l'académie</p>
                        <div class="flex gap-4">
                          <label class="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-gray-600">
                            <input 
                              type="radio" 
                              name="notificationType" 
                              value="immediate" 
                              [checked]="prefNotificationType() === 'immediate'"
                              (change)="setNotificationType('immediate')"
                              class="accent-academy-blue"
                            /> Instantané
                          </label>
                          <label class="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-gray-600">
                            <input 
                              type="radio" 
                              name="notificationType" 
                              value="daily" 
                              [checked]="prefNotificationType() === 'daily'"
                              (change)="setNotificationType('daily')"
                              class="accent-academy-blue"
                            /> Hebdomadaire
                          </label>
                        </div>
                      </div>
                    </div>

                    <div class="space-y-3">
                      <h4 class="text-xs font-black uppercase text-academy-blue tracking-wider flex items-center gap-2">
                        <span class="material-icons text-sm">sports_soccer</span> Poste de prédilection & Aspirations
                      </h4>

                      <div class="p-3.5 bg-gray-50/50 rounded-xl border border-gray-100 space-y-2">
                        <p class="text-xs font-bold text-gray-800 uppercase tracking-wide">Filtre des actualités sportives</p>
                        <select 
                          [value]="prefPosition()" 
                          (change)="changePrefPosition($any($event.target).value)"
                          class="w-full text-xs font-bold text-academy-blue bg-white border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-academy-blue"
                        >
                          <option value="all">Tous les postes / Général</option>
                          <option value="Gardiens">Spécifique Gardiens de but</option>
                          <option value="Défenseurs">Tactique Défensive</option>
                          <option value="Milieux">Jeu de construction & Milieux</option>
                          <option value="Attaquants">Finition & Attaquants</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer button action inside the settings panel -->
                <div class="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button 
                    (click)="activeTab.set('records')"
                    class="px-5 py-3 border border-gray-200 text-gray-500 rounded-xl font-display font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    Retour aux dossiers
                  </button>
                  <button 
                    (click)="savePreferences()"
                    class="bg-academy-blue text-white px-6 py-3.5 rounded-xl font-display font-black uppercase tracking-widest text-xs hover:bg-academy-blue-light hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span class="material-icons text-sm">save</span> Enregistrer réglages
                  </button>
                </div>
              </div>
            } @else if (activeTab() === 'profile') {
              <!-- Profile Section -->
              <div class="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-xl space-y-8 animate-in fade-in duration-300">
                <div class="border-b border-gray-100 pb-6 flex items-center justify-between gap-4">
                  <div>
                    <h3 class="text-xl font-display font-black text-academy-blue uppercase italic">Profil Joueur / Membre</h3>
                    <p class="text-xs text-gray-400 leading-normal mt-1">Complétez vos détails sportifs et coordonnées de contact.</p>
                  </div>
                  <span class="material-icons text-academy-blue/20 text-4xl hidden sm:block">person_outline</span>
                </div>

                @if (profileSaved()) {
                  <div class="p-4 bg-green-50/80 border border-green-200/50 text-green-800 rounded-2xl flex items-center gap-3 animate-in fade-in duration-300">
                    <span class="material-icons text-green-600">check_circle</span>
                    <p class="text-xs font-bold uppercase tracking-widest">Votre profil a été mis à jour avec succès !</p>
                  </div>
                }

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <!-- General Information -->
                  <div class="space-y-4">
                    <h4 class="text-xs font-black uppercase text-academy-blue tracking-wider flex items-center gap-2">
                       <span class="material-icons text-sm">badge</span> Informations Générales
                    </h4>

                    <div class="space-y-4">
                      <div class="space-y-1">
                        <span class="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Nom complet</span>
                        <input 
                          type="text" 
                          [value]="profileDisplayName()" 
                          (input)="profileDisplayName.set($any($event.target).value)"
                          class="w-full text-xs font-bold text-academy-blue bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-academy-blue rounded-xl p-3.5 focus:outline-none transition-colors"
                          placeholder="Ex: John Doe"
                        />
                      </div>

                      <div class="space-y-1">
                        <span class="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Téléphone de contact</span>
                        <input 
                          type="tel" 
                          [value]="profilePhoneNumber()" 
                          (input)="profilePhoneNumber.set($any($event.target).value)"
                          class="w-full text-xs font-bold text-academy-blue bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-academy-blue rounded-xl p-3.5 focus:outline-none transition-colors"
                          placeholder="Ex: +221 77 000 00 00"
                        />
                      </div>

                      <div class="space-y-1">
                        <span class="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Date de naissance</span>
                        <input 
                          type="date" 
                          [value]="profileBirthDate()" 
                          (input)="profileBirthDate.set($any($event.target).value)"
                          class="w-full text-xs font-bold text-academy-blue bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-academy-blue rounded-xl p-3.5 focus:outline-none transition-colors"
                        />
                      </div>

                      <div class="space-y-1">
                        <span class="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Adresse ou Ville de résidence</span>
                        <input 
                          type="text" 
                          [value]="profileAddress()" 
                          (input)="profileAddress.set($any($event.target).value)"
                          class="w-full text-xs font-bold text-academy-blue bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-academy-blue rounded-xl p-3.5 focus:outline-none transition-colors"
                          placeholder="Ex: Dakar, Sénégal"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Athletic Details -->
                  <div class="space-y-4">
                    <h4 class="text-xs font-black uppercase text-academy-blue tracking-wider flex items-center gap-2">
                      <span class="material-icons text-sm">sports_soccer</span> Détails Sportifs & Préférences
                    </h4>

                    <div class="space-y-4">
                      <div class="space-y-1">
                        <span class="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Pied de prédilection</span>
                        <select 
                          [value]="profilePreferredFoot()" 
                          (change)="profilePreferredFoot.set($any($event.target).value)"
                          class="w-full text-xs font-bold text-academy-blue bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-academy-blue rounded-xl p-3.5 focus:outline-none transition-colors text-left"
                        >
                          <option value="Droit">Droitier (Droit)</option>
                          <option value="Gauche">Gaucher (Gauche)</option>
                          <option value="Les deux">Ambidextre (Les deux)</option>
                        </select>
                      </div>

                      <div class="space-y-1">
                        <span class="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Club de coeur / Préféré (Pro)</span>
                        <input 
                          type="text" 
                          [value]="profileFavoriteClub()" 
                          (input)="profileFavoriteClub.set($any($event.target).value)"
                          class="w-full text-xs font-bold text-academy-blue bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-academy-blue rounded-xl p-3.5 focus:outline-none transition-colors"
                          placeholder="Ex: Real Madrid, PSG, FC Barcelone"
                        />
                      </div>

                      <div class="space-y-1">
                        <span class="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Ma motivation ou bio sportive</span>
                        <textarea 
                          rows="4"
                          [value]="profileMotivation()" 
                          (input)="profileMotivation.set($any($event.target).value)"
                          class="w-full text-xs font-bold text-academy-blue bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-academy-blue rounded-xl p-3.5 focus:outline-none transition-colors resize-none"
                          placeholder="Parlez-nous de vos objectifs à l'Académie sportive..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button 
                    (click)="activeTab.set('records')"
                    class="px-5 py-3 border border-gray-200 text-gray-500 rounded-xl font-display font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    Retour aux dossiers
                  </button>
                  <button 
                    (click)="saveProfile()"
                    [disabled]="isSavingProfile()"
                    class="bg-academy-blue text-white px-6 py-3.5 rounded-xl font-display font-black uppercase tracking-widest text-xs hover:bg-academy-blue-light hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-55"
                  >
                    <span class="material-icons text-sm">
                      {{ isSavingProfile() ? 'sync' : 'save_alt' }}
                    </span>
                    {{ isSavingProfile() ? 'Enregistrement...' : 'Enregistrer mon Profil' }}
                  </button>
                </div>
              </div>
            }

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
  preferences = inject(Preferences);

  registrations = signal<UserRegistration[]>([]);
  isLoading = signal(false);

  pendingCount = signal(0);
  acceptedCount = signal(0);
  rejectedCount = signal(0);

  // Custom view and personalization settings mapped directly to global Preferences
  activeTab = signal<'records' | 'settings' | 'profile'>('records');
  prefLanguage = this.preferences.language;
  prefEmailAlerts = this.preferences.emailAlerts;
  prefSmsAlerts = this.preferences.smsAlerts;
  prefCompactMode = this.preferences.compactMode;
  prefPosition = this.preferences.preferredPosition;
  prefNotificationType = this.preferences.notificationType;
  settingsSaved = signal(false);

  // Profile Signals
  profileDisplayName = signal('');
  profilePhoneNumber = signal('');
  profileBirthDate = signal('');
  profileAddress = signal('');
  profileFavoriteClub = signal('');
  profilePreferredFoot = signal<'Droit' | 'Gauche' | 'Les deux'>('Droit');
  profileMotivation = signal('');
  isSavingProfile = signal(false);
  profileSaved = signal(false);

  constructor() {
    // Re-run registration query every time authorized user changes
    effect(() => {
      const currentUser = this.authService.user();
      if (currentUser) {
        this.loadUserRegistrations(currentUser.uid);
        this.loadProfile(currentUser.uid);
      } else {
        this.registrations.set([]);
        this.clearCounts();
      }
    });
  }

  toggleCompactMode() {
    this.prefCompactMode.update(v => !v);
  }

  toggleEmailAlerts() {
    this.prefEmailAlerts.update(v => !v);
  }

  toggleSmsAlerts() {
    this.prefSmsAlerts.update(v => !v);
  }

  changeLanguage(lang: string) {
    this.prefLanguage.set(lang);
  }

  setNotificationType(type: 'immediate' | 'daily') {
    this.prefNotificationType.set(type);
  }

  changePrefPosition(pos: string) {
    this.prefPosition.set(pos);
  }

  async savePreferences() {
    const currentUser = this.authService.user();
    if (!currentUser) return;

    try {
      await this.preferences.save();
      this.settingsSaved.set(true);
      setTimeout(() => {
        this.settingsSaved.set(false);
      }, 3000);
    } catch (e) {
      console.error('Error saving local preferences:', e);
    }
  }

  async loadProfile(userId: string) {
    try {
      const snap = await this.firebaseService.getDocument<Record<string, unknown>>('users', userId);
      if (snap) {
        this.profileDisplayName.set(String(snap['displayName'] || ''));
        this.profilePhoneNumber.set(String(snap['phoneNumber'] || ''));
        this.profileBirthDate.set(String(snap['birthDate'] || ''));
        this.profileAddress.set(String(snap['address'] || ''));
        this.profileFavoriteClub.set(String(snap['favoriteClub'] || ''));
        this.profilePreferredFoot.set((snap['preferredFoot'] as 'Droit' | 'Gauche' | 'Les deux') || 'Droit');
        this.profileMotivation.set(String(snap['motivation'] || ''));
      } else {
        const currentUser = this.authService.user();
        if (currentUser) {
          this.profileDisplayName.set(currentUser.displayName || '');
        }
      }
    } catch (e) {
      console.error('Error loading profile:', e);
    }
  }

  async saveProfile() {
    const currentUser = this.authService.user();
    if (!currentUser) return;

    this.isSavingProfile.set(true);
    try {
      const payload = {
        displayName: this.profileDisplayName(),
        phoneNumber: this.profilePhoneNumber(),
        birthDate: this.profileBirthDate(),
        address: this.profileAddress(),
        favoriteClub: this.profileFavoriteClub(),
        preferredFoot: this.profilePreferredFoot(),
        motivation: this.profileMotivation(),
        updatedAt: new Date().toISOString()
      };
      
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, payload, { merge: true });
      
      this.profileSaved.set(true);
      setTimeout(() => {
        this.profileSaved.set(false);
      }, 3000);
    } catch (e) {
      console.error('Error saving profile:', e);
    } finally {
      this.isSavingProfile.set(false);
    }
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
