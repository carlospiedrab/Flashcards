import { Injectable } from '@angular/core';
import { GameType } from '../models/game-type.model';

export interface RecordResult {
  /** Best score stored before this game. */
  readonly previous: number;
  /** True when the new score beats the previous best. */
  readonly isNew: boolean;
  /** Best score after this game. */
  readonly best: number;
}

/** Persists the best score per game in localStorage (fails silently when unavailable). */
@Injectable({ providedIn: 'root' })
export class ScoreStorageService {
  private key(type: GameType): string {
    return `best-${type}`;
  }

  best(type: GameType): number {
    try {
      const value = Number(localStorage.getItem(this.key(type)));
      return Number.isFinite(value) && value > 0 ? value : 0;
    } catch {
      return 0;
    }
  }

  submit(type: GameType, score: number): RecordResult {
    const previous = this.best(type);
    const isNew = score > previous;
    if (isNew) {
      try {
        localStorage.setItem(this.key(type), String(score));
      } catch {
        // Storage blocked (private mode, quota…): the record just isn't persisted.
      }
    }
    return { previous, isNew, best: Math.max(previous, score) };
  }
}
