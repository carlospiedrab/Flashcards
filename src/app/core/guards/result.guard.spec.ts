import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { CARDS_PER_GAME, GameService } from '../services/game.service';
import { resultGuard } from './result.guard';

@Component({ template: '' })
class DummyComponent {}

describe('resultGuard', () => {
  let router: Router;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: DummyComponent },
          { path: 'flagflip', component: DummyComponent },
          { path: 'landflip', component: DummyComponent },
          { path: ':game/resultado', canActivate: [resultGuard], component: DummyComponent },
        ]),
      ],
    });
    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
  });

  function finishGame(type: 'flagflip' | 'landflip'): void {
    const game = TestBed.inject(GameService);
    game.start(type);
    for (let i = 0; i < CARDS_PER_GAME; i++) {
      game.answer(game.currentCard()?.item.answer ?? '');
      game.next();
    }
  }

  it('redirects unknown games to home', async () => {
    await harness.navigateByUrl('/ajedrez/resultado');
    expect(router.url).toBe('/');
  });

  it('redirects to the game when there is no finished game in memory', async () => {
    await harness.navigateByUrl('/flagflip/resultado');
    expect(router.url).toBe('/flagflip');
  });

  it('redirects to the game when the finished game is a different one', async () => {
    finishGame('landflip');
    await harness.navigateByUrl('/flagflip/resultado');
    expect(router.url).toBe('/flagflip');
  });

  it('redirects while a game is still in progress', async () => {
    TestBed.inject(GameService).start('landflip');
    await harness.navigateByUrl('/landflip/resultado');
    expect(router.url).toBe('/landflip');
  });

  it('allows the result of a finished game', async () => {
    finishGame('landflip');
    await harness.navigateByUrl('/landflip/resultado');
    expect(router.url).toBe('/landflip/resultado');
  });
});
