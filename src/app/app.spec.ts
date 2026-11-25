import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { COUNTRIES } from './core/data/countries.data';
import { PLACES } from './core/data/places.data';
import { resultMessage } from './features/result/result.component';

describe('App', () => {
  it('renders the toolbar logo linking home', async () => {
    TestBed.configureTestingModule({ imports: [App], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const logo = (fixture.nativeElement as HTMLElement).querySelector('mat-toolbar a');
    expect(logo?.textContent).toContain('Flashcards');
    expect(logo?.getAttribute('href')).toBe('/');
  });
});

describe('Game data', () => {
  it('has 69 countries and 22 places with unique ids and asset paths', () => {
    expect(COUNTRIES).toHaveLength(69);
    expect(PLACES).toHaveLength(22);
    expect(new Set(COUNTRIES.map((c) => c.id)).size).toBe(69);
    expect(new Set(COUNTRIES.map((c) => c.capital)).size).toBe(69);
    expect(new Set(PLACES.map((p) => p.id)).size).toBe(22);
    COUNTRIES.forEach((c) => expect(c.flag).toBe(`flags/${c.id}.svg`));
    PLACES.forEach((p) => expect(p.image).toBe(`places/${p.id}.svg`));
  });
});

describe('resultMessage', () => {
  it.each([
    [10, '¡Perfecto, eres un experto!'],
    [9, '¡Excelente partida!'],
    [8, '¡Excelente partida!'],
    [7, '¡Bien hecho, vas por buen camino!'],
    [5, '¡Bien hecho, vas por buen camino!'],
    [4, '¡Sigue practicando!'],
    [0, '¡Sigue practicando!'],
  ])('%i aciertos → %s', (hits, message) => {
    expect(resultMessage(hits)).toBe(message);
  });
});
