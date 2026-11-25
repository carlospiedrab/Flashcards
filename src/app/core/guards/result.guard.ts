import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isGameType } from '../models/game-type.model';
import { GameService } from '../services/game.service';

/**
 * `/:game/resultado` only accepts known games, and only when that game has a
 * finished session in memory. Otherwise it redirects to the game (or home).
 */
export const resultGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const game = route.paramMap.get('game');
  if (!isGameType(game)) return router.createUrlTree(['/']);
  return inject(GameService).hasFinished(game) ? true : router.createUrlTree(['/', game]);
};
