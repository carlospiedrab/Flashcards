import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type SegmentState = 'ok' | 'bad' | 'now' | 'pending';

/** "Carta N de 10" plus one segment per card: green, red, current or pending. */
@Component({
  selector: 'app-progress-dots',
  template: `
    <div class="flex items-center gap-2.5 text-sm font-bold">
      <span>Carta {{ index() + 1 }} de {{ total() }}</span>
      <div class="flex flex-1 gap-1.5" role="img" [attr.aria-label]="label()">
        @for (segment of segments(); track $index) {
          <span
            class="h-2 flex-1 rounded-[9px]"
            [class]="segmentClasses[segment]"
            [attr.data-state]="segment"
          ></span>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressDotsComponent {
  readonly total = input.required<number>();
  /** Zero-based index of the current card. */
  readonly index = input.required<number>();
  /** One entry per answered card: true when it was correct. */
  readonly results = input.required<readonly boolean[]>();

  protected readonly segmentClasses: Readonly<Record<SegmentState, string>> = {
    ok: 'bg-ok',
    bad: 'bg-bad',
    now: 'bg-(--accent)',
    pending: 'bg-white/20',
  };

  protected readonly segments = computed<SegmentState[]>(() =>
    Array.from({ length: this.total() }, (_, k) => {
      const result = this.results()[k];
      if (result !== undefined) return result ? 'ok' : 'bad';
      return k === this.index() ? 'now' : 'pending';
    }),
  );

  protected readonly label = computed(() => {
    const hits = this.results().filter(Boolean).length;
    const misses = this.results().length - hits;
    return `Progreso: ${hits} aciertos y ${misses} fallos de ${this.total()} cartas`;
  });
}
