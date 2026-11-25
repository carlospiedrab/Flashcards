import { ResolveFn, Routes } from '@angular/router';
import { GAMES } from './core/data/games.data';
import { resultGuard } from './core/guards/result.guard';
import { isGameType } from './core/models/game-type.model';

const resultTitle: ResolveFn<string> = (route) => {
  const game = route.paramMap.get('game');
  return isGameType(game) ? `Resultado ${GAMES[game].title} · Flashcards` : 'Flashcards';
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Inicio · Flashcards',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'flagflip',
    title: 'FlagFlip · Flashcards',
    loadComponent: () =>
      import('./features/flag-flip/flag-flip.component').then((m) => m.FlagFlipComponent),
  },
  {
    path: 'landflip',
    title: 'LandFlip · Flashcards',
    loadComponent: () =>
      import('./features/land-flip/land-flip.component').then((m) => m.LandFlipComponent),
  },
  {
    path: ':game/resultado',
    canActivate: [resultGuard],
    title: resultTitle,
    loadComponent: () =>
      import('./features/result/result.component').then((m) => m.ResultComponent),
  },
  { path: '**', redirectTo: '' },
];
