import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { GameAnswer } from '../../core/models/game-answer.model';
import { AnswerOptionsComponent } from '../../shared/components/answer-options/answer-options.component';
import { FlipCardComponent } from '../../shared/components/flip-card/flip-card.component';
import { GameHeaderComponent } from '../../shared/components/game-header/game-header.component';
import { ProgressDotsComponent } from '../../shared/components/progress-dots/progress-dots.component';
import { GameScreen } from '../../shared/game-screen';

@Component({
  selector: 'app-land-flip',
  imports: [
    MatButton,
    AnswerOptionsComponent,
    FlipCardComponent,
    GameHeaderComponent,
    ProgressDotsComponent,
  ],
  templateUrl: './land-flip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandFlipComponent extends GameScreen {
  protected readonly gameType = 'landflip';

  protected describe({ correct, picked, card }: GameAnswer): string {
    const fact = `Este lugar es ${card.item.name}, en ${card.item.location}.`;
    return correct
      ? `¡Correcto! ${fact} +${this.points} puntos.`
      : `Incorrecto. Elegiste ${picked}. ${fact}`;
  }
}
