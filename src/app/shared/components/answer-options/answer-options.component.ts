import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

type OptionState = 'idle' | 'right' | 'wrong' | 'dim';

/** The three answer buttons. They lock and get colored once `picked` is set. */
@Component({
  selector: 'app-answer-options',
  template: `
    <div class="grid gap-2.5" role="group" aria-label="Opciones de respuesta">
      @for (option of options(); track option; let i = $index) {
        @let state = stateOf(option);
        <button
          type="button"
          class="flex min-h-14 items-center gap-3 rounded-2xl px-4 text-left text-[17px] font-extrabold shadow-[0_4px_0_rgba(0,0,0,.2)] transition-[translate,background-color] duration-200 enabled:cursor-pointer enabled:hover:-translate-y-0.5 disabled:cursor-default motion-reduce:transition-none"
          [class.bg-card]="state === 'idle' || state === 'dim'"
          [class.text-card-ink]="state === 'idle' || state === 'dim'"
          [class.bg-ok]="state === 'right'"
          [class.bg-bad]="state === 'wrong'"
          [class.text-white]="state === 'right' || state === 'wrong'"
          [class.opacity-55]="state === 'dim'"
          [attr.data-state]="state"
          [attr.aria-keyshortcuts]="i + 1"
          [disabled]="picked() !== null"
          (click)="choose.emit(option)"
        >
          <kbd
            class="grid size-[30px] flex-none place-items-center rounded-[9px] bg-line font-display text-[15px] font-bold text-card-ink"
            aria-hidden="true"
            >{{ i + 1 }}</kbd
          >
          {{ option }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswerOptionsComponent {
  readonly options = input.required<readonly string[]>();
  readonly correct = input.required<string>();
  /** Option chosen by the player; null while the card is open. */
  readonly picked = input<string | null>(null);
  readonly choose = output<string>();

  protected stateOf(option: string): OptionState {
    const picked = this.picked();
    if (picked === null) return 'idle';
    if (option === this.correct()) return 'right';
    return option === picked ? 'wrong' : 'dim';
  }
}
