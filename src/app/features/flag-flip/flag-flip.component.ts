import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { GameAnswer } from '../../core/models/game-answer.model';
import { AnswerOptionsComponent } from '../../shared/components/answer-options/answer-options.component';
import { FlipCardComponent } from '../../shared/components/flip-card/flip-card.component';
import { GameHeaderComponent } from '../../shared/components/game-header/game-header.component';
import { ProgressDotsComponent } from '../../shared/components/progress-dots/progress-dots.component';
import { GameScreen } from '../../shared/game-screen';

@Component({
  selector: 'app-flag-flip',
  imports: [
    MatButton,
    AnswerOptionsComponent,
    FlipCardComponent,
    GameHeaderComponent,
    ProgressDotsComponent,
  ],
  templateUrl: './flag-flip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlagFlipComponent extends GameScreen {
  protected readonly gameType = 'flagflip';

  protected describe({ correct, picked, card }: GameAnswer): string {
    const fact = `La capital de ${card.item.name} es ${card.item.answer}.`;
    return correct
      ? `¡Correcto! ${fact} +${this.points} puntos.`
      : `Incorrecto. Elegiste ${picked}. ${fact}`;
  }
}
