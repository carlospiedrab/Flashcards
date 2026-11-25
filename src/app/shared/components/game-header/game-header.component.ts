import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScoreBadgeComponent } from '../score-badge/score-badge.component';

/** Game HUD: back link, game title and score. */
@Component({
  selector: 'app-game-header',
  imports: [RouterLink, ScoreBadgeComponent],
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <a
        routerLink="/"
        class="inline-flex min-h-11 items-center rounded-full bg-white/14 px-4 font-bold no-underline"
        >← Inicio</a
      >
      <h1 class="text-[28px] max-[600px]:text-[22px]">{{ title() }}</h1>
      <app-score-badge [score]="score()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameHeaderComponent {
  readonly title = input.required<string>();
  readonly score = input.required<number>();
}
