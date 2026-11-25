import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';

/** Score box. It "bumps" every time the score goes up. */
@Component({
  selector: 'app-score-badge',
  host: { class: 'ml-auto' },
  template: `
    <div
      class="rounded-2xl bg-(--accent) px-3.5 py-1.5 text-center leading-[1.1] font-extrabold text-ink motion-reduce:animate-none"
      [class]="bumpClass()"
      data-testid="score"
    >
      <b class="block font-display text-[26px] font-bold">{{ score() }}</b>puntos
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreBadgeComponent {
  readonly score = input.required<number>();

  /** Number of times the score went up. */
  private readonly bumps = linkedSignal<number, number>({
    source: this.score,
    computation: (score, previous) =>
      previous && score > previous.source ? previous.value + 1 : (previous?.value ?? 0),
  });

  /**
   * Alternates between two identical animations: changing the animation name
   * restarts it without re-creating the element.
   */
  protected readonly bumpClass = computed(() => {
    const bumps = this.bumps();
    if (bumps === 0) return '';
    return bumps % 2 ? 'animate-bump' : 'animate-bump-alt';
  });
}
