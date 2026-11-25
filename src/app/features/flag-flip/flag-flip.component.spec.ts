import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { resultGuard } from '../../core/guards/result.guard';
import { CARDS_PER_GAME, GameService } from '../../core/services/game.service';
import { FlagFlipComponent } from './flag-flip.component';

@Component({ template: 'resultado' })
class DummyResultComponent {}

describe('FlagFlipComponent', () => {
  let harness: RouterTestingHarness;
  let game: GameService;

  const press = (key: string): void => {
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  };
  const nextButton = (): HTMLButtonElement | null =>
    harness.routeNativeElement?.querySelector('button.fc-btn-next') ?? null;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'flagflip', component: FlagFlipComponent },
          { path: ':game/resultado', canActivate: [resultGuard], component: DummyResultComponent },
        ]),
      ],
    });
    game = TestBed.inject(GameService);
    harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/flagflip');
  });

  it('starts a new game showing the flag, the country and the question', () => {
    const card = game.currentCard();
    const el = harness.routeNativeElement as HTMLElement;
    expect(card).not.toBeNull();
    expect(el.textContent).toContain('Carta 1 de 10');
    expect(el.textContent).toContain(card?.item.name);
    expect(el.textContent).toContain('¿Cuál es su capital?');
    expect(el.querySelector('img')?.getAttribute('alt')).toBe(`Bandera de ${card?.item.name}`);
    expect(nextButton()).toBeNull();
  });

  it('answers with 1-3, announces it and continues with Enter', async () => {
    const card = game.currentCard();
    press('2');
    await harness.fixture.whenStable();

    expect(game.currentAnswer()?.picked).toBe(card?.options[1]);
    expect(nextButton()?.textContent).toContain('Siguiente carta');
    const live = harness.routeNativeElement?.querySelector('[aria-live]');
    expect(live?.textContent).toContain(`La capital de ${card?.item.name} es ${card?.item.answer}`);

    press('1'); // ignored: the card is locked
    expect(game.session()?.answers).toHaveLength(1);

    press('Enter');
    await harness.fixture.whenStable();
    expect(game.session()?.index).toBe(1);
    expect(nextButton()).toBeNull();
  });

  it('navigates to the result after the 10th card', async () => {
    for (let i = 0; i < CARDS_PER_GAME; i++) {
      press('1');
      await harness.fixture.whenStable();
      if (i === CARDS_PER_GAME - 1) expect(nextButton()?.textContent).toContain('Ver resultado');
      press('Enter');
      await harness.fixture.whenStable();
    }
    expect(TestBed.inject(Router).url).toBe('/flagflip/resultado');
  });
});
