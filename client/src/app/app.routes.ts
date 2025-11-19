import { Routes } from '@angular/router';
import { GameBoardComponent } from './components/game-board/game-board';
import { LobbyComponent } from './components/lobby/lobby';

export const routes: Routes = [
  { path: '', component: LobbyComponent },
  { path: 'game', component: GameBoardComponent }
];
