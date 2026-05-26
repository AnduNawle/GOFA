import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../core/services/firebase';
import { Match, Player, NewsArticle } from '../../core/models/entities';
import { limit, orderBy, where } from 'firebase/firestore';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <section class="relative h-[85vh] flex items-center overflow-hidden bg-academy-blue group">
        <!-- Background Overlay & Image -->
        <div class="absolute inset-0">
           <img 
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000" 
            alt="Academy Players" 
            class="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-10000"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-academy-blue via-academy-blue/80 to-transparent"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-8 animate-in fade-in slide-in-from-left duration-700">
              <div class="space-y-2">
                <h3 class="text-academy-yellow font-display font-bold uppercase tracking-[0.2em] text-sm md:text-base">Bienvenue à GOFA</h3>
                <h1 class="text-6xl md:text-8xl font-display font-black text-white leading-[0.9] tracking-tighter uppercase italic">
                  Le talent <br/> <span class="text-academy-yellow italic">se construit ici</span>
                </h1>
              </div>
              <p class="text-white/80 text-lg md:text-xl max-w-xl leading-relaxed">
                Golf Océan Football Academy forme les champions de demain avec passion, discipline et excellence.
              </p>
              <div class="flex flex-wrap gap-4 pt-4">
                <button [routerLink]="['/academy']" class="bg-academy-yellow text-academy-blue px-8 py-4 rounded-md font-display font-bold uppercase tracking-widest text-sm hover:bg-white transition-all shadow-xl flex items-center gap-3 group/btn cursor-pointer">
                  Découvrir l'académie
                  <span class="material-icons text-sm group-hover/btn:translate-x-1 transition-transform">chevron_right</span>
                </button>
                <button [routerLink]="['/matches']" class="bg-transparent border-2 border-white/20 text-white px-8 py-4 rounded-md font-display font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center gap-3 cursor-pointer">
                  Voir les matchs
                </button>
              </div>
            </div>

            <!-- Last Match Widget -->
            <div class="hidden lg:block animate-in fade-in slide-in-from-right duration-700 delay-300">
              @if (lastMatch(); as match) {
                <div class="bg-academy-blue-light/80 backdrop-blur-md p-8 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden group/card shadow-gold">
                  <div class="absolute top-0 right-0 p-4 opacity-10">
                    <span class="text-6xl font-display font-black uppercase text-white tracking-widest">GOFA</span>
                  </div>
                  
                  <div class="relative z-10">
                    <h4 class="text-center text-academy-yellow font-display font-bold uppercase tracking-widest text-xs mb-10 border-b border-white/10 pb-4">Dernier Match</h4>
                    
                    <div class="flex items-center justify-between gap-8 mb-8 px-4">
                      <div class="flex flex-col items-center gap-4 group/team">
                        <div class="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center p-4 border border-white/10 group-hover/team:scale-110 transition-transform">
                          <img [src]="match.homeLogo || '/images/gofalogo.jpg'" alt="GOFA" class="w-full h-full object-contain" />
                        </div>
                        <span class="text-white font-display font-bold uppercase tracking-widest text-sm">{{ match.homeTeam }}</span>
                      </div>

                      <div class="flex flex-col items-center">
                        <div class="text-6xl font-display font-black text-white flex items-center gap-4 italic">
                          <span>{{ match.homeScore ?? 0 }}</span>
                          <span class="text-academy-yellow">-</span>
                          <span>{{ match.awayScore ?? 0 }}</span>
                        </div>
                      </div>

                      <div class="flex flex-col items-center gap-4 group/team">
                        <div class="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center p-4 border border-white/10 group-hover/team:scale-110 transition-transform">
                          <img [src]="match.awayLogo || 'https://firebasestorage.googleapis.com/v0/b/gofa-academy.appspot.com/o/assets%2Flogo_opp.png?alt=media'" alt="Opponent" class="w-full h-full object-contain brightness-0 invert opacity-80" />
                        </div>
                        <span class="text-white font-display font-bold uppercase tracking-widest text-sm">{{ match.awayTeam }}</span>
                      </div>
                    </div>

                    <div class="text-center space-y-1 mb-10">
                      <p class="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">{{ match.category }} - {{ match.competition }}</p>
                      <p class="text-white/40 text-[10px] uppercase tracking-widest font-medium">{{ match.date?.toDate() | date:'dd MMMM yyyy' }} - {{ match.location }}</p>
                    </div>

                    <button [routerLink]="['/matches']" class="w-full py-4 border border-white/20 rounded-lg text-white font-display font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-academy-blue transition-all cursor-pointer">
                      Voir tous les résultats
                    </button>
                  </div>
                </div>
              } @else {
                <!-- Placeholder for Last Match if none found -->
                <div class="bg-white/5 backdrop-blur-md p-12 rounded-2xl border border-white/10 flex items-center justify-center">
                  <p class="text-white/40 uppercase tracking-widest text-xs font-bold font-display italic">Aucun match récent</p>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Strips -->
      <section class="bg-academy-blue border-y border-white/5 py-12 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="flex items-center gap-6 group">
              <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-academy-yellow group-hover:bg-academy-yellow group-hover:text-academy-blue transition-all">
                <span class="material-icons text-3xl">people</span>
              </div>
              <div class="flex flex-col">
                <span class="text-3xl font-display font-black text-white italic">250+</span>
                <span class="text-[10px] text-white/40 font-bold uppercase tracking-widest">Jeunes formés</span>
              </div>
            </div>
            
            <div class="flex items-center gap-6 group">
              <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-academy-yellow group-hover:bg-academy-yellow group-hover:text-academy-blue transition-all">
                <span class="material-icons text-3xl">emoji_events</span>
              </div>
              <div class="flex flex-col">
                <span class="text-3xl font-display font-black text-white italic">15+</span>
                <span class="text-[10px] text-white/40 font-bold uppercase tracking-widest">Trophées remportés</span>
              </div>
            </div>

            <div class="flex items-center gap-6 group">
              <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-academy-yellow group-hover:bg-academy-yellow group-hover:text-academy-blue transition-all">
                <span class="material-icons text-3xl">school</span>
              </div>
              <div class="flex flex-col">
                <span class="text-3xl font-display font-black text-white italic">50+</span>
                <span class="text-[10px] text-white/40 font-bold uppercase tracking-widest">Joueurs transférés</span>
              </div>
            </div>

            <div class="flex items-center gap-6 group">
              <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-academy-yellow group-hover:bg-academy-yellow group-hover:text-academy-blue transition-all">
                <span class="material-icons text-3xl">public</span>
              </div>
              <div class="flex flex-col">
                <span class="text-3xl font-display font-black text-white italic">1</span>
                <span class="text-[10px] text-white/40 font-bold uppercase tracking-widest">Joueur à l'international</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content Grid -->
      <section class="py-24 bg-gray-50 relative overflow-hidden">
        <!-- Abstract background shapes -->
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-academy-blue/5 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-academy-yellow/10 blur-3xl"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16">
            
            <!-- News Column -->
            <div class="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
              <div class="flex flex-col gap-2 border-b border-gray-200 pb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-academy-blue/10 flex items-center justify-center text-academy-blue">
                    <span class="material-icons">campaign</span>
                  </div>
                  <h2 class="text-2xl font-display font-black uppercase tracking-widest text-gray-900 italic">Actualités</h2>
                </div>
                <p class="text-sm font-medium text-gray-500">Les dernières infos du club</p>
              </div>
              
              <div class="flex-1 space-y-8">
                @for (article of latestNews(); track article.id) {
                  <div class="group cursor-pointer bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full">
                    <div class="relative rounded-2xl overflow-hidden aspect-[4/3] mb-6 shadow-md">
                      <div class="absolute inset-0 bg-academy-blue/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                      <img [src]="article.imageUrl || 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1000'" alt="Actualité" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" referrerpolicy="no-referrer" />
                      <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-academy-blue px-3 py-1.5 font-display font-bold uppercase text-[10px] tracking-widest rounded-full z-20 shadow-lg">
                        {{ article.date?.toDate() | date:'dd MMM yyyy' }}
                      </div>
                      <div class="absolute bottom-4 right-4 bg-academy-yellow text-academy-blue px-3 py-1.5 font-display font-black uppercase text-[10px] tracking-widest rounded-full z-20 shadow-lg">
                        {{ article.category }}
                      </div>
                    </div>
                    <div class="px-2 flex-1 flex flex-col">
                      <h3 class="text-xl font-display font-black text-gray-900 leading-tight mb-3 group-hover:text-academy-blue transition-colors">{{ article.title }}</h3>
                      <p class="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6 flex-1">
                        {{ article.content }}
                      </p>
                      <div class="mt-auto flex items-center gap-2 text-xs font-black uppercase tracking-widest text-academy-blue group-hover:text-academy-yellow transition-colors">
                        Lire la suite 
                        <div class="w-6 h-6 rounded-full bg-academy-blue/10 flex items-center justify-center group-hover:bg-academy-yellow/20 group-hover:translate-x-2 transition-all">
                          <span class="material-icons text-sm">arrow_forward</span>
                        </div>
                      </div>
                    </div>
                  </div>
                } @empty {
                  <div class="bg-white rounded-3xl p-8 border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm h-full w-full">
                    <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                      <span class="material-icons text-gray-300 text-4xl">article</span>
                    </div>
                    <h3 class="font-display font-bold text-gray-500 uppercase tracking-widest text-sm mb-2">Aucune publication</h3>
                    <p class="text-xs text-gray-400">Revenez plus tard pour les dernières actualités de l'académie.</p>
                  </div>
                }
              </div>
            </div>

            <!-- Matches Column -->
            <div class="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
              <div class="flex flex-col gap-2 border-b border-gray-200 pb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-academy-yellow/20 flex items-center justify-center text-academy-yellow">
                    <span class="material-icons">event</span>
                  </div>
                  <h2 class="text-2xl font-display font-black uppercase tracking-widest text-gray-900 italic">Prochains Matchs</h2>
                </div>
                <p class="text-sm font-medium text-gray-500">Ne manquez aucun événement</p>
              </div>

              <div class="flex-1 space-y-4">
                @for (match of upcomingMatches(); track match.id; let i = $index) {
                  <!-- Match Item -->
                  <div class="relative bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group overflow-hidden" [style.transition-delay.ms]="i * 100">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-academy-blue/5 to-transparent rounded-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div class="flex items-center gap-5 relative z-10">
                      <!-- Date Badge -->
                      <div class="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 group-hover:bg-academy-blue group-hover:border-academy-blue group-hover:text-white transition-colors duration-500 min-w-[75px] h-[85px] rounded-2xl shadow-sm">
                        <span class="text-2xl font-display font-black italic">{{ match.date?.toDate() | date:'dd' }}</span>
                        <span class="text-[10px] uppercase font-bold tracking-widest opacity-80">{{ match.date?.toDate() | date:'MMM' }}</span>
                      </div>
                      
                      <!-- Details -->
                      <div class="flex flex-col flex-1 py-1">
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-xs font-display font-black uppercase tracking-widest text-gray-900 group-hover:text-academy-blue transition-colors">
                            {{ match.homeTeam }} <span class="text-gray-400 mx-1 font-normal">vs</span> {{ match.awayTeam }}
                          </span>
                        </div>
                        
                        <div class="flex items-center gap-3 mb-2">
                          <span class="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 group-hover:bg-academy-blue/10 group-hover:text-academy-blue text-[9px] font-bold uppercase tracking-widest rounded-lg transition-colors">
                            {{ match.category }}
                          </span>
                          <span class="text-[10px] text-gray-500 font-medium uppercase tracking-widest">{{ match.competition }}</span>
                        </div>
                        
                        <div class="flex items-center justify-between text-[11px] text-gray-400 font-medium mt-auto border-t border-gray-50 pt-2 group-hover:border-academy-blue/10">
                          <div class="flex items-center gap-1.5">
                            <span class="material-icons text-[14px]">schedule</span>
                            {{ match.date?.toDate() | date:'HH:mm' }}
                          </div>
                          <div class="flex items-center gap-1.5 truncate max-w-[120px]">
                            <span class="material-icons text-[14px]">location_on</span>
                            <span class="truncate">{{ match.location }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                } @empty {
                  <div class="bg-white rounded-3xl p-8 border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm h-full w-full">
                    <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                      <span class="material-icons text-gray-300 text-4xl">sports_soccer</span>
                    </div>
                    <h3 class="font-display font-bold text-gray-500 uppercase tracking-widest text-sm mb-2">Aucun match prévu</h3>
                    <p class="text-xs text-gray-400">Le calendrier des prochaines rencontres sera mis à jour.</p>
                  </div>
                }
              </div>

              <div class="pt-4 mt-auto">
                <button [routerLink]="['/matches']" class="w-full py-4 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-academy-blue hover:border-academy-blue hover:bg-academy-blue hover:text-white transition-all cursor-pointer group">
                  Voir tout le calendrier 
                  <span class="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>

            <!-- Player Column -->
            <div class="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
              <div class="flex flex-col gap-2 border-b border-gray-200 pb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-academy-blue/10 flex items-center justify-center text-academy-blue">
                    <span class="material-icons">star_rate</span>
                  </div>
                  <h2 class="text-2xl font-display font-black uppercase tracking-widest text-gray-900 italic">Joueur à la Une</h2>
                </div>
                <p class="text-sm font-medium text-gray-500">Le talent de la semaine</p>
              </div>

              @if (playerOfTheWeek(); as player) {
                <div class="bg-gradient-to-br from-academy-blue to-[#002f5a] rounded-3xl p-8 border border-white/10 relative group overflow-hidden shadow-2xl flex-1 flex flex-col justify-center transform hover:-translate-y-2 transition-all duration-500">
                  <!-- Decorative elements -->
                  <div class="absolute top-0 right-0 -mt-10 -mr-10 text-[180px] text-white/5 font-display font-black italic leading-none pointer-events-none select-none">
                    #1
                  </div>
                  <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-academy-yellow/20 rounded-full blur-3xl pointer-events-none transition-transform duration-1000 group-hover:scale-150 group-hover:bg-academy-yellow/30"></div>
                  
                  <div class="relative z-10 flex flex-col items-center text-center py-4">
                    <div class="relative mb-8">
                      <!-- Animated rings -->
                      <div class="absolute inset-0 rounded-full border-2 border-academy-yellow border-dashed animate-[spin_10s_linear_infinite] scale-[1.15] opacity-70"></div>
                      <div class="absolute inset-0 rounded-full border-2 border-white/20 animate-[spin_15s_linear_infinite_reverse] scale-[1.3]"></div>
                      
                      <div class="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500 bg-white relative z-10">
                        <img [src]="player.photoUrl || 'https://images.unsplash.com/photo-1510566337590-2fc1f21100ce?q=80&w=800'" [alt]="player.name" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
                      </div>
                      
                      <div class="absolute bottom-2 right-2 bg-academy-yellow text-academy-blue w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform rotate-12 -translate-y-2 translate-x-2 border-2 border-white z-20 group-hover:rotate-[360deg] transition-transform duration-1000">
                        <span class="material-icons text-xl">workspace_premium</span>
                      </div>
                    </div>
                    
                    <span class="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-[10px] font-bold uppercase tracking-widest mb-4 border border-white/20">
                      {{ player.position }} &bull; {{ player.category }}
                    </span>
                    
                    <h3 class="text-3xl font-display font-black text-white mb-8 italic tracking-wide group-hover:text-academy-yellow transition-colors">{{ player.name }}</h3>
                    
                    <div class="w-full bg-black/20 rounded-2xl p-6 backdrop-blur-sm border border-white/5 group-hover:bg-black/30 transition-colors">
                      <div class="grid grid-cols-3 gap-4">
                        <div class="flex flex-col items-center justify-center group/stat">
                          <span class="text-3xl font-display font-black italic text-academy-yellow group-hover/stat:scale-110 transition-transform">{{ player.stats?.matches || 0 }}</span>
                          <span class="text-[9px] uppercase font-bold tracking-widest text-white/50 mt-1">Matchs</span>
                        </div>
                        <div class="flex flex-col items-center justify-center border-x border-white/10 group/stat">
                          <span class="text-3xl font-display font-black italic text-white group-hover/stat:scale-110 group-hover/stat:text-academy-yellow transition-all">{{ player.stats?.goals || 0 }}</span>
                          <span class="text-[9px] uppercase font-bold tracking-widest text-white/50 mt-1">Buts</span>
                        </div>
                        <div class="flex flex-col items-center justify-center group/stat">
                          <span class="text-3xl font-display font-black italic text-white group-hover/stat:scale-110 group-hover/stat:text-academy-yellow transition-all">{{ player.stats?.assists || 0 }}</span>
                          <span class="text-[9px] uppercase font-bold tracking-widest text-white/50 mt-1">Passes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              } @else {
                <div class="bg-white rounded-3xl p-10 border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm min-h-[450px]">
                  <div class="relative w-32 h-32 mb-6 group">
                    <div class="absolute inset-0 bg-gray-100 rounded-full rotate-12 -z-10 opacity-50"></div>
                    <div class="w-full h-full bg-gray-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                      <span class="material-icons text-gray-300 text-6xl">person_outline</span>
                    </div>
                  </div>
                  <h3 class="font-display font-bold text-gray-500 uppercase tracking-widest text-sm mb-2">En attente d'élection</h3>
                  <p class="text-xs text-gray-400">Le joueur mis à l'honneur sera bientôt dévoilé ici.</p>
                </div>
              }

              <div class="pt-4 mt-auto">
                <button [routerLink]="['/players']" class="w-full py-4 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-academy-blue hover:border-academy-blue hover:bg-academy-blue hover:text-white transition-all cursor-pointer group">
                  Découvrir nos talents 
                  <span class="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Gallery Strip -->
      <section class="py-24 bg-gray-50 overflow-hidden relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-academy-blue/10 flex items-center justify-center text-academy-blue">
                  <span class="material-icons">photo_library</span>
                </div>
                <h2 class="text-3xl font-display font-black uppercase tracking-widest text-gray-900 italic">Galerie<span class="text-academy-blue">.</span></h2>
              </div>
              <p class="text-sm font-medium text-gray-500">Nos plus beaux moments en images</p>
            </div>
            <button [routerLink]="['/gallery']" class="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-academy-blue hover:text-academy-yellow transition-colors cursor-pointer group">
              Voir toute la galerie 
              <div class="w-8 h-8 rounded-full bg-academy-blue/10 flex items-center justify-center group-hover:bg-academy-yellow/20 group-hover:translate-x-2 transition-all">
                <span class="material-icons text-sm">arrow_forward</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Marquee -->
        <div class="relative w-full overflow-hidden pause-on-hover pb-10 pt-4">
          <!-- Left and Right fade gradients -->
          <div class="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
          <div class="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
          
          <div class="flex w-max gap-6 animate-marquee pl-6">
            @for (img of galleryImages; track $index) {
              <div class="w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-[2rem] overflow-hidden group cursor-pointer shadow-xl border-[6px] border-white shrink-0 relative bg-gray-200">
                <div class="absolute inset-0 bg-gradient-to-tr from-academy-blue/90 via-academy-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img [src]="img.url" [alt]="img.title" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" referrerpolicy="no-referrer" />
                
                <div class="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 z-20 translate-y-4 group-hover:translate-y-0">
                  <span class="text-academy-yellow text-xs font-bold uppercase tracking-widest mb-1">{{ img.category }}</span>
                  <h3 class="text-white font-display font-black text-xl italic leading-tight">{{ img.title }}</h3>
                </div>

                <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                  <div class="bg-white/20 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-white border border-white/20">
                    <span class="material-icons">zoom_in</span>
                  </div>
                </div>
              </div>
            }
            @for (img of galleryImages; track $index) {
              <div class="w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-[2rem] overflow-hidden group cursor-pointer shadow-xl border-[6px] border-white shrink-0 relative bg-gray-200">
                <div class="absolute inset-0 bg-gradient-to-tr from-academy-blue/90 via-academy-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img [src]="img.url" [alt]="img.title" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" referrerpolicy="no-referrer" />
                
                <div class="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 z-20 translate-y-4 group-hover:translate-y-0">
                  <span class="text-academy-yellow text-xs font-bold uppercase tracking-widest mb-1">{{ img.category }}</span>
                  <h3 class="text-white font-display font-black text-xl italic leading-tight">{{ img.title }}</h3>
                </div>

                <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                  <div class="bg-white/20 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-white border border-white/20">
                    <span class="material-icons">zoom_in</span>
                  </div>
                </div>
              </div>
            }
            @for (img of galleryImages; track $index) {
              <div class="w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-[2rem] overflow-hidden group cursor-pointer shadow-xl border-[6px] border-white shrink-0 relative bg-gray-200">
                <div class="absolute inset-0 bg-gradient-to-tr from-academy-blue/90 via-academy-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img [src]="img.url" [alt]="img.title" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" referrerpolicy="no-referrer" />
                
                <div class="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 z-20 translate-y-4 group-hover:translate-y-0">
                  <span class="text-academy-yellow text-xs font-bold uppercase tracking-widest mb-1">{{ img.category }}</span>
                  <h3 class="text-white font-display font-black text-xl italic leading-tight">{{ img.title }}</h3>
                </div>

                <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                  <div class="bg-white/20 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-white border border-white/20">
                    <span class="material-icons">zoom_in</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
    
    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-33.333333%); }
    }
    
    .animate-marquee {
      animation: marquee 35s linear infinite;
    }
    
    .pause-on-hover:hover .animate-marquee {
      animation-play-state: paused;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private firebase = inject(FirebaseService);

  galleryImages = [
    { url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop', title: 'Entraînement U17', category: 'Training' },
    { url: 'https://images.unsplash.com/photo-1518605368461-1e128224b456?q=80&w=800&auto=format&fit=crop', title: 'Match de coupe', category: 'Compétition' },
    { url: 'https://images.unsplash.com/photo-1551280857-2b9bbe5240dc?q=80&w=800&auto=format&fit=crop', title: 'Victoire', category: 'Célébration' },
    { url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop', title: 'Tactique', category: 'Vestiaire' },
    { url: 'https://images.unsplash.com/photo-1431324155629-1a5bb018cc16?q=80&w=800&auto=format&fit=crop', title: 'Coup franc', category: 'Action' },
    { url: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?q=80&w=800&auto=format&fit=crop', title: 'Échauffement', category: 'Avant-match' }
  ];

  lastMatch = signal<Match | null>(null);
  upcomingMatches = signal<Match[]>([]);
  playerOfTheWeek = signal<Player | null>(null);
  latestNews = signal<NewsArticle[]>([]);

  ngOnInit() {
    this.fetchHomeData();
  }

  private async fetchHomeData() {
    console.log('Fetching home data...');
    try {
      // Last match (finished)
      const matches = await this.firebase.getCollection<Match>('matches', [
        orderBy('date', 'desc'),
        limit(5)
      ]);
      console.log('Matches fetched:', matches.length);
      
      const finished = matches.find((m: Match) => m.isFinished);
      if (finished) this.lastMatch.set(finished);

      const upcoming = matches.filter((m: Match) => !m.isFinished).slice(0, 3);
      this.upcomingMatches.set(upcoming);

      // Player of the week
      const pWeek = await this.firebase.getCollection<Player>('players', [
        where('isPlayerOfTheWeek', '==', true),
        limit(1)
      ]);
      console.log('Player of week fetched:', pWeek.length);
      if (pWeek.length > 0) this.playerOfTheWeek.set(pWeek[0]);

      // News
      const news = await this.firebase.getCollection<NewsArticle>('news', [
        orderBy('date', 'desc'),
        limit(3)
      ]);
      console.log('News fetched:', news.length);
      this.latestNews.set(news);
      
      // Load mock data if it's completely empty so users don't see an empty shell
      if (matches.length === 0 && pWeek.length === 0 && news.length === 0) {
        this.setMockData();
      }
    } catch (e) {
      console.error('Error fetching home data:', e);
      this.setMockData();
    }
  }

  private setMockData() {
    const mockDate1 = new Date();
    mockDate1.setDate(mockDate1.getDate() - 2);
    const mockDate2 = new Date();
    mockDate2.setDate(mockDate2.getDate() + 5);

    this.lastMatch.set({
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
    });

    this.upcomingMatches.set([{
      id: 'mock2',
      homeTeam: 'Golf Océan Academy',
      awayTeam: 'Génération Foot',
      category: 'U15',
      competition: 'Coupe Sénégal',
      date: { toDate: () => mockDate2 } as any,
      isFinished: false,
      homeScore: undefined,
      awayScore: undefined,
      homeLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=GO&backgroundColor=004481&textColor=ffffff',
      awayLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=GF&backgroundColor=e63946&textColor=ffffff',
      location: 'Déni Birame Ndao'
    }]);

    this.playerOfTheWeek.set({
      id: 'mock_p1',
      name: 'Amadou Diallo',
      age: 16,
      category: 'U17',
      position: 'Attaquant',
      photoUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&fit=crop',
      stats: { goals: 12, assists: 4, matches: 15 }
    });

    this.latestNews.set([
      {
        id: 'news1',
        title: 'Victoire éclatante des U17',
        content: 'Nos jeunes U17 ont brillé ce weekend face à Dakar Sacré-Cœur avec une victoire 2-1 pleine de caractère. Une belle démonstration de force.',
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
        date: { toDate: () => mockDate1 } as any,
        category: 'Matchs'
      }
    ]);
  }
}
