import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardOutcome, FlipCardComponent } from './flip-card.component';

@Component({
  imports: [FlipCardComponent],
  template: `
    <app-flip-card [outcome]="outcome()" [picked]="picked()" [points]="10">
      <p cardFront>Frente</p>
      <p cardBack>Detalle</p>
    </app-flip-card>
  `,
})
class HostComponent {
  readonly outcome = signal<CardOutcome | null>(null);
  readonly picked = signal<string | null>(null);
}

describe('FlipCardComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let el: HTMLElement;

  const card = (): HTMLElement => el.querySelector('[data-testid="card"]') as HTMLElement;
  const back = (): HTMLElement => el.querySelector('.face-back') as HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(HostComponent);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('shows the front, unflipped and dealing, while there is no outcome', () => {
    expect(card().classList).not.toContain('flipped');
    expect(card().classList).toContain('animate-deal');
    expect(el.textContent).toContain('Frente');
    expect(back().textContent?.trim()).toBe('');
    expect(back().getAttribute('aria-hidden')).toBe('true');
  });

  it('flips to a green back with the points when correct', async () => {
    fixture.componentInstance.outcome.set('correct');
    await fixture.whenStable();
    expect(card().classList).toContain('flipped');
    expect(back().classList).toContain('bg-ok');
    expect(back().textContent).toContain('¡Correcto!');
    expect(back().textContent).toContain('Detalle');
    expect(back().textContent).toContain('+10 puntos');
    expect(back().getAttribute('aria-hidden')).toBe('false');
  });

  it('flips to a red back with the picked option when wrong', async () => {
    fixture.componentInstance.picked.set('Lima');
    fixture.componentInstance.outcome.set('wrong');
    await fixture.whenStable();
    expect(card().classList).toContain('flipped');
    expect(back().classList).toContain('bg-bad');
    expect(back().textContent).toContain('Incorrecto');
    expect(back().textContent).toContain('Elegiste: Lima');
  });
});
