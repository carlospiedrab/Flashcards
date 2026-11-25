import { GameCard } from './game-card.model';

export interface GameAnswer {
  readonly card: GameCard;
  readonly picked: string;
  readonly correct: boolean;
}
