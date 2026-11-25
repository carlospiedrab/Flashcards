import { Injectable, computed, inject, signal } from '@angular/core';
import { GAMES } from '../data/games.data';
import { GameAnswer } from '../models/game-answer.model';
import { GameCard, GameItem } from '../models/game-card.model';
import { GameType } from '../models/game-type.model';
import { RANDOM, shuffle } from './random';
import { RecordResult, ScoreStorageService } from './score-storage.service';

export const CARDS_PER_GAME = 10;
export const OPTIONS_PER_CARD = 3;
export const POINTS_PER_HIT = 10;

export interface GameSession {
  readonly type: GameType;
  readonly cards: readonly GameCard[];
  /** Index of the card being played. */
  readonly index: number;
  readonly answers: readonly GameAnswer[];
  readonly finished: boolean;
  /** Set when the game finishes. */
  readonly record: RecordResult | null;
}

/** Holds the state of the current game. Shared by FlagFlip and LandFlip. */
@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly random = inject(RANDOM);
  private readonly scores = inject(ScoreStorageService);
  private readonly state = signal<GameSession | null>(null);

  readonly session = this.state.asReadonly();
  readonly currentCard = computed<GameCard | null>(() => {
    const s = this.state();
    return s ? (s.cards[s.index] ?? null) : null;
  });
  /** Answer given to the current card, or null while it is still open. */
  readonly currentAnswer = computed<GameAnswer | null>(() => {
    const s = this.state();
    return s ? (s.answers[s.index] ?? null) : null;
  });
  readonly hits = computed(() => this.state()?.answers.filter((a) => a.correct).length ?? 0);
  readonly score = computed(() => this.hits() * POINTS_PER_HIT);
  readonly isLastCard = computed(() => {
    const s = this.state();
    return s !== null && s.index === s.cards.length - 1;
  });

  /** Starts a new game of the given type, discarding any previous one. */
  start(type: GameType): void {
    const items = GAMES[type].items;
    const cards = shuffle(items, this.random)
      .slice(0, CARDS_PER_GAME)
      .map((item) => this.buildCard(item, items));
    this.state.set({ type, cards, index: 0, answers: [], finished: false, record: null });
  }

  /** Starts a new game of the same type as the current one. */
  restart(): void {
    const s = this.state();
    if (s) this.start(s.type);
  }

  /** Answers the current card. Returns null if the answer is not accepted. */
  answer(option: string): GameAnswer | null {
    const s = this.state();
    const card = this.currentCard();
    if (!s || !card || s.finished || this.currentAnswer() || !card.options.includes(option)) {
      return null;
    }
    const answer: GameAnswer = { card, picked: option, correct: option === card.item.answer };
    this.state.set({ ...s, answers: [...s.answers, answer] });
    return answer;
  }

  /**
   * Moves on once the current card is answered. Returns `finished` after the
   * last card, `next` otherwise, or null when not allowed.
   */
  next(): 'next' | 'finished' | null {
    const s = this.state();
    if (!s || s.finished || !this.currentAnswer()) return null;
    if (this.isLastCard()) {
      const record = this.scores.submit(s.type, this.score());
      this.state.set({ ...s, finished: true, record });
      return 'finished';
    }
    this.state.set({ ...s, index: s.index + 1 });
    return 'next';
  }

  hasFinished(type: GameType): boolean {
    const s = this.state();
    return s !== null && s.type === type && s.finished;
  }

  private buildCard(item: GameItem, pool: readonly GameItem[]): GameCard {
    const distractors = shuffle(
      pool.filter((other) => other.answer !== item.answer),
      this.random,
    )
      .slice(0, OPTIONS_PER_CARD - 1)
      .map((other) => other.answer);
    return { item, options: shuffle([item.answer, ...distractors], this.random) };
  }
}
