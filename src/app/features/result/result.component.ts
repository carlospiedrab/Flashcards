import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { GAMES } from '../../core/data/games.data';
import { GameAnswer } from '../../core/models/game-answer.model';
import { GameType } from '../../core/models/game-type.model';
import { CARDS_PER_GAME, GameService } from '../../core/services/game.service';

export function resultMessage(hits: number): string {
  if (hits >= CARDS_PER_GAME) return '¡Perfecto, eres un experto!';
  if (hits >= 8) return '¡Excelente partida!';
  if (hits >= 5) return '¡Bien hecho, vas por buen camino!';
  return '¡Sigue practicando!';
}

@Component({
  selector: 'app-result',
  imports: [MatButton, RouterLink],
  host: { '[class]': 'definition().accentClass' },
  templateUrl: './result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultComponent {
  /** Route parameter; `resultGuard` guarantees it is a valid, finished game. */
  readonly game = input.required<GameType>();

  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  protected readonly total = CARDS_PER_GAME;
  protected readonly definition = computed(() => GAMES[this.game()]);
  protected readonly isFlag = computed(() => this.game() === 'flagflip');
  protected readonly answers = computed<readonly GameAnswer[]>(
    () => this.gameService.session()?.answers ?? [],
  );
  protected readonly hits = this.gameService.hits;
  protected readonly score = this.gameService.score;
  protected readonly record = computed(() => this.gameService.session()?.record ?? null);
  protected readonly message = computed(() => resultMessage(this.hits()));

  protected playAgain(): void {
    void this.router.navigate(['/', this.game()]);
  }
}
