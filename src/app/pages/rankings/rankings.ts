import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rankings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <section class="bg-academy-blue py-20 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h1 class="text-5xl font-display font-black uppercase italic tracking-tighter">Classements</h1>
           <p class="text-academy-yellow font-display font-medium uppercase tracking-widest text-xs mt-2">Saison 2025/2026</p>
        </div>
      </section>

      <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
             <div class="overflow-x-auto">
               <table class="w-full text-left">
                  <thead>
                    <tr class="bg-academy-blue text-white font-display font-bold uppercase text-[10px] tracking-widest text-center">
                      <th class="px-6 py-6 text-left">Pos</th>
                      <th class="px-6 py-6 text-left">Club</th>
                      <th class="px-6 py-6">MJ</th>
                      <th class="px-6 py-6">V</th>
                      <th class="px-6 py-6">N</th>
                      <th class="px-6 py-6">D</th>
                      <th class="px-6 py-6">BP</th>
                      <th class="px-6 py-6">BC</th>
                      <th class="px-6 py-6">PTS</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    @for (team of mockRankings; track team.pos) {
                      <tr class="hover:bg-gray-50 transition-colors text-center group" [class.bg-academy-yellow/5]="team.club === 'GOFA'">
                         <td class="px-6 py-5 font-display font-black italic text-academy-blue">{{ team.pos }}</td>
                         <td class="px-6 py-5 text-left">
                            <div class="flex items-center gap-4">
                               <img [src]="team.logo" class="h-8 w-8 object-contain" [alt]="'Logo ' + team.club">
                               <span class="font-display font-bold uppercase tracking-widest text-xs text-academy-blue">{{ team.club }}</span>
                            </div>
                         </td>
                         <td class="px-6 py-5 text-xs font-bold text-gray-500">{{ team.mj }}</td>
                         <td class="px-6 py-5 text-xs font-bold text-gray-500">{{ team.v }}</td>
                         <td class="px-6 py-5 text-xs font-bold text-gray-500">{{ team.n }}</td>
                         <td class="px-6 py-5 text-xs font-bold text-gray-500">{{ team.d }}</td>
                         <td class="px-6 py-5 text-xs font-bold text-gray-500">{{ team.bp }}</td>
                         <td class="px-6 py-5 text-xs font-bold text-gray-500">{{ team.bc }}</td>
                         <td class="px-6 py-5 font-display font-black text-academy-blue">{{ team.pts }}</td>
                      </tr>
                    }
                  </tbody>
               </table>
             </div>
          </div>
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingsComponent {
  mockRankings = [
    { pos: 1, club: 'GOFA', mj: 10, v: 8, n: 0, d: 2, bp: 25, bc: 8, pts: 24, logo: 'images/gofalogo.jpg' },
    { pos: 2, club: 'GUÉPARD', mj: 10, v: 7, n: 0, d: 3, bp: 20, bc: 10, pts: 21, logo: 'https://firebasestorage.googleapis.com/v0/b/gofa-academy.appspot.com/o/assets%2Flogo_opp.png?alt=media' },
    { pos: 3, club: 'MBALLING', mj: 10, v: 6, n: 0, d: 4, bp: 18, bc: 12, pts: 18, logo: 'https://firebasestorage.googleapis.com/v0/b/gofa-academy.appspot.com/o/assets%2Flogo_opp.png?alt=media' },
    { pos: 4, club: 'ATLANTIQUE', mj: 10, v: 4, n: 1, d: 5, bp: 15, bc: 14, pts: 13, logo: 'https://firebasestorage.googleapis.com/v0/b/gofa-academy.appspot.com/o/assets%2Flogo_opp.png?alt=media' },
    { pos: 5, club: 'DIAMBARS', mj: 10, v: 4, n: 1, d: 5, bp: 12, bc: 15, pts: 13, logo: 'https://firebasestorage.googleapis.com/v0/b/gofa-academy.appspot.com/o/assets%2Flogo_opp.png?alt=media' },
  ];
}
