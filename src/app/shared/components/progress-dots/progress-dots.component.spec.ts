import { TestBed } from '@angular/core/testing';
import { ProgressDotsComponent } from './progress-dots.component';

describe('ProgressDotsComponent', () => {
  it('renders one segment per card with its state', async () => {
    const fixture = TestBed.createComponent(ProgressDotsComponent);
    fixture.componentRef.setInput('total', 10);
    fixture.componentRef.setInput('index', 2);
    fixture.componentRef.setInput('results', [true, false]);
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    const states = Array.from(el.querySelectorAll<HTMLElement>('[data-state]')).map(
      (s) => s.dataset['state'],
    );
    expect(el.textContent).toContain('Carta 3 de 10');
    expect(states).toEqual(['ok', 'bad', 'now', ...Array<string>(7).fill('pending')]);
  });
});
