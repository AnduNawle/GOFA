import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from './shared/components/navbar';
import {FooterComponent} from './shared/components/footer';
import {ChasingBallsComponent} from './shared/components/chasing-balls';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ChasingBallsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
