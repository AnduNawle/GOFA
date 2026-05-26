import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { MatchesComponent } from './pages/matches/matches';
import { PlayersComponent } from './pages/players/players';
import { AcademyComponent } from './pages/academy/academy';
import { GalleryComponent } from './pages/gallery/gallery';
import { RankingsComponent } from './pages/rankings/rankings';
import { TransfersComponent } from './pages/transfers/transfers';
import { RegistrationComponent } from './pages/registration/registration';
import { ContactComponent } from './pages/contact/contact';
import { NotFoundComponent } from './pages/not-found/not-found';
import { Admin } from './pages/admin/admin';
import { AccountComponent } from './pages/account/account';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'matches', component: MatchesComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'academy', component: AcademyComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'rankings', component: RankingsComponent },
  { path: 'transfers', component: TransfersComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'admin', component: Admin },
  { path: 'account', component: AccountComponent },
  { path: '**', component: NotFoundComponent },
];
