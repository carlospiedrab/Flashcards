import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnswerOptionsComponent } from './answer-options.component';

describe('AnswerOptionsComponent', () => {
  let fixture: ComponentFixture<AnswerOptionsComponent>;

  const buttons = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('button'));

  beforeEach(async () => {
    fixture = TestBed.createComponent(AnswerOptionsComponent);
    fixture.componentRef.setInput('options', ['Lima', 'Quito', 'Bogotá']);
    fixture.componentRef.setInput('correct', 'Quito');
    await fixture.whenStable();
  });

  it('renders numbered, enabled options', () => {
    expect(buttons().map((b) => b.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      '1 Lima',
      '2 Quito',
      '3 Bogotá',
    ]);
    expect(buttons().every((b) => !b.disabled)).toBe(true);
  });

  it('emits the chosen option', () => {
    const chosen: string[] = [];
    fixture.componentInstance.choose.subscribe((o) => chosen.push(o));
    buttons()[2].click();
    expect(chosen).toEqual(['Bogotá']);
  });

  it('locks and colours the options after a wrong answer', async () => {
    fixture.componentRef.setInput('picked', 'Lima');
    await fixture.whenStable();
    expect(buttons().every((b) => b.disabled)).toBe(true);
    expect(buttons().map((b) => b.dataset['state'])).toEqual(['wrong', 'right', 'dim']);
    expect(buttons()[1].classList).toContain('bg-ok');
    expect(buttons()[0].classList).toContain('bg-bad');
  });

  it('marks only the correct option after a right answer', async () => {
    fixture.componentRef.setInput('picked', 'Quito');
    await fixture.whenStable();
    expect(buttons().map((b) => b.dataset['state'])).toEqual(['dim', 'right', 'dim']);
  });
});
