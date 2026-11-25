import {
  Directive,
  ElementRef,
  Injector,
  OnInit,
  afterNextRender,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { GAMES, GameDefinition } from '../core/data/games.data';
import { GameAnswer } from '../core/models/game-answer.model';
import { GameCard } from '../core/models/game-card.model';
import { GameType } from '../core/models/game-type.model';
import { CARDS_PER_GAME, GameService, POINTS_PER_HIT } from '../core/services/game.service';
import { CardOutcome } from './components/flip-card/flip-card.component';

/**
 * Behaviour shared by the FlagFlip and LandFlip screens: starting the game,
 * answering, moving on, keyboard shortcuts and screen-reader announcements.
 * Subclasses only provide the game type, the card content and the announcement text.
 */
@Directive({
  host: {
    '[class]': 'definition.accentClass',
    '(document:keydown)': 'onKeydown($event)',
  },
})
export abstract class GameScreen implements OnInit {
  protected abstract readonly gameType: GameType;

  protected readonly game = inject(GameService);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly nextButton = viewChild('nextButton', { read: ElementRef<HTMLElement> });

  protected readonly total = CARDS_PER_GAME;
  protected readonly points = POINTS_PER_HIT;
  protected readonly card = this.game.currentCard;
  protected readonly answer = this.game.currentAnswer;
  protected readonly score = this.game.score;
  protected readonly isLastCard = this.game.isLastCard;
  /** The current card as a one-item list, so `@for … track id` re-deals each new card. */
  protected readonly deck = computed<GameCard[]>(() => {
    const card = this.card();
    return card ? [card] : [];
  });
  protected readonly index = computed(() => this.game.session()?.index ?? 0);
  protected readonly results = computed(
    () => this.game.session()?.answers.map((a) => a.correct) ?? [],
  );
  protected readonly outcome = computed<CardOutcome | null>(() => {
    const answer = this.answer();
    if (!answer) return null;
    return answer.correct ? 'correct' : 'wrong';
  });
  protected readonly announcement = computed(() => {
    const answer = this.answer();
    return answer ? this.describe(answer) : '';
  });

  protected get definition(): GameDefinition {
    return GAMES[this.gameType];
  }

  /** Text announced through aria-live after answering. */
  protected abstract describe(answer: GameAnswer): string;

  ngOnInit(): void {
    this.game.start(this.gameType);
  }

  protected choose(option: string): void {
    if (!this.game.answer(option)) return;
    afterNextRender(() => this.nextButton()?.nativeElement.focus({ preventScroll: true }), {
      injector: this.injector,
    });
  }

  protected next(): void {
    if (this.game.next() === 'finished') {
      void this.router.navigate(['/', this.gameType, 'resultado']);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    const card = this.card();
    if (!card || event.altKey || event.ctrlKey || event.metaKey) return;

    const position = ['1', '2', '3'].indexOf(event.key);
    if (position >= 0 && !this.answer()) {
      const option = card.options[position];
      if (option !== undefined) this.choose(option);
      return;
    }

    // Enter on a focused button/link already activates it natively.
    const target = event.target;
    const onControl = target instanceof HTMLElement && target.closest('button, a') !== null;
    if (event.key === 'Enter' && this.answer() && !onControl) {
      event.preventDefault();
      this.next();
    }
  }
}
