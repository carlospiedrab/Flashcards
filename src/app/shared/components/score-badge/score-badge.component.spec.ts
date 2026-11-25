import { TestBed } from '@angular/core/testing';
import { ScoreBadgeComponent } from './score-badge.component';

describe('ScoreBadgeComponent', () => {
  it('shows the score and replays the bump each time it goes up', async () => {
    const fixture = TestBed.createComponent(ScoreBadgeComponent);
    const box = (): HTMLElement => fixture.nativeElement.querySelector('[data-testid="score"]');

    fixture.componentRef.setInput('score', 0);
    await fixture.whenStable();
    expect(box().textContent).toContain('0');
    expect(box().className).not.toMatch(/animate-bump/);

    fixture.componentRef.setInput('score', 10);
    await fixture.whenStable();
    expect(box().textContent).toContain('10');
    expect(box().classList).toContain('animate-bump');

    fixture.componentRef.setInput('score', 20);
    await fixture.whenStable();
    expect(box().classList).toContain('animate-bump-alt');
    expect(box().classList).not.toContain('animate-bump');
  });
});
