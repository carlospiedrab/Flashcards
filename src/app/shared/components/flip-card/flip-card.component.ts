import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type CardOutcome = 'correct' | 'wrong';

/**
 * A card that flips 180° on the Y axis once it has an outcome.
 * Project the front with `[cardFront]` and the answer details with `[cardBack]`.
 * Re-create the component (e.g. `@for … track id`) to replay the "deal" animation.
 */
@Component({
  selector: 'app-flip-card',
  templateUrl: './flip-card.component.html',
  styleUrl: './flip-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlipCardComponent {
  readonly outcome = input<CardOutcome | null>(null);
  /** Option the player picked (shown on the back when wrong). */
  readonly picked = input<string | null>(null);
  readonly points = input(0);

  protected readonly flipped = computed(() => this.outcome() !== null);
}
