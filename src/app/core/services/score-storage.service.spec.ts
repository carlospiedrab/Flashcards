import { TestBed } from '@angular/core/testing';
import { ScoreStorageService } from './score-storage.service';

describe('ScoreStorageService', () => {
  let service: ScoreStorageService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(ScoreStorageService);
  });

  afterEach(() => vi.restoreAllMocks());

  it('returns 0 when there is no record', () => {
    expect(service.best('flagflip')).toBe(0);
  });

  it('stores only better scores, per game', () => {
    expect(service.submit('flagflip', 50)).toEqual({ previous: 0, isNew: true, best: 50 });
    expect(service.submit('flagflip', 30)).toEqual({ previous: 50, isNew: false, best: 50 });
    expect(service.best('flagflip')).toBe(50);
    expect(service.best('landflip')).toBe(0);
  });

  it('survives an unavailable localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(service.best('landflip')).toBe(0);
    expect(service.submit('landflip', 40)).toEqual({ previous: 0, isNew: true, best: 40 });
  });
});
