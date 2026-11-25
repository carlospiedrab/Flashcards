import { TestBed } from '@angular/core/testing';
import { GAMES } from '../data/games.data';
import { GAME_TYPES, GameType } from '../models/game-type.model';
import { CARDS_PER_GAME, GameService, OPTIONS_PER_CARD, POINTS_PER_HIT } from './game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  /** Answers the current card right or wrong and returns the picked option. */
  function answerCurrent(correct: boolean): string {
    const card = service.currentCard();
    if (!card) throw new Error('no card');
    const option = correct ? card.item.answer : card.options.find((o) => o !== card.item.answer);
    if (option === undefined) throw new Error('no option');
    service.answer(option);
    return option;
  }

  function playAll(type: GameType, hits: number): void {
    service.start(type);
    for (let i = 0; i < CARDS_PER_GAME; i++) {
      answerCurrent(i < hits);
      service.next();
    }
  }

  for (const type of GAME_TYPES) {
    describe(type, () => {
      it(`deals ${CARDS_PER_GAME} cards without repeats`, () => {
        for (let round = 0; round < 25; round++) {
          service.start(type);
          const cards = service.session()?.cards ?? [];
          expect(cards).toHaveLength(CARDS_PER_GAME);
          expect(new Set(cards.map((c) => c.item.id)).size).toBe(CARDS_PER_GAME);
        }
      });

      it('gives each card 3 unique options with exactly one correct answer', () => {
        const answers = new Set(GAMES[type].items.map((i) => i.answer));
        for (let round = 0; round < 25; round++) {
          service.start(type);
          for (const card of service.session()?.cards ?? []) {
            expect(card.options).toHaveLength(OPTIONS_PER_CARD);
            expect(new Set(card.options).size).toBe(OPTIONS_PER_CARD);
            expect(card.options.filter((o) => o === card.item.answer)).toHaveLength(1);
            card.options.forEach((o) => expect(answers.has(o)).toBe(true));
          }
        }
      });
    });
  }

  it('starts at the first card with a zero score', () => {
    service.start('flagflip');
    expect(service.session()?.index).toBe(0);
    expect(service.score()).toBe(0);
    expect(service.currentAnswer()).toBeNull();
    expect(service.session()?.finished).toBe(false);
  });

  it('adds points only for correct answers', () => {
    service.start('flagflip');
    answerCurrent(true);
    expect(service.score()).toBe(POINTS_PER_HIT);
    expect(service.currentAnswer()?.correct).toBe(true);

    service.next();
    const picked = answerCurrent(false);
    expect(service.score()).toBe(POINTS_PER_HIT);
    expect(service.currentAnswer()).toEqual(expect.objectContaining({ correct: false, picked }));
  });

  it('locks the card after the first answer and ignores unknown options', () => {
    service.start('landflip');
    expect(service.answer('No es una opción')).toBeNull();
    answerCurrent(false);
    expect(service.answer(service.currentCard()?.item.answer ?? '')).toBeNull();
    expect(service.session()?.answers).toHaveLength(1);
    expect(service.score()).toBe(0);
  });

  it('only moves on once the current card is answered', () => {
    service.start('flagflip');
    expect(service.next()).toBeNull();
    expect(service.session()?.index).toBe(0);
    answerCurrent(true);
    expect(service.next()).toBe('next');
    expect(service.session()?.index).toBe(1);
    expect(service.currentAnswer()).toBeNull();
  });

  it('finishes after the last card and stores the record', () => {
    playAll('flagflip', 7);
    const session = service.session();
    expect(session?.finished).toBe(true);
    expect(session?.answers).toHaveLength(CARDS_PER_GAME);
    expect(service.hits()).toBe(7);
    expect(service.score()).toBe(70);
    expect(session?.record).toEqual({ previous: 0, isNew: true, best: 70 });
    expect(service.hasFinished('flagflip')).toBe(true);
    expect(service.hasFinished('landflip')).toBe(false);
    expect(localStorage.getItem('best-flagflip')).toBe('70');
    // Nothing else can happen once finished.
    expect(service.next()).toBeNull();
  });

  it('keeps the previous record when the new score is lower', () => {
    playAll('landflip', 9);
    playAll('landflip', 3);
    expect(service.session()?.record).toEqual({ previous: 90, isNew: false, best: 90 });
  });

  it('restarts a fresh game of the same type', () => {
    playAll('landflip', 10);
    service.restart();
    const session = service.session();
    expect(session?.type).toBe('landflip');
    expect(session?.finished).toBe(false);
    expect(session?.answers).toHaveLength(0);
    expect(session?.index).toBe(0);
    expect(service.score()).toBe(0);
    expect(service.hasFinished('landflip')).toBe(false);
  });
});
