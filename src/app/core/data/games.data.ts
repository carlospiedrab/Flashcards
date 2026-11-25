import { GameItem } from '../models/game-card.model';
import { GameType } from '../models/game-type.model';
import { COUNTRIES } from './countries.data';
import { PLACES } from './places.data';

export interface GameDefinition {
  readonly type: GameType;
  readonly title: string;
  readonly question: string;
  /** CSS class that sets the `--accent` custom property (see tailwind.css). */
  readonly accentClass: string;
  readonly items: readonly GameItem[];
}

export const GAMES: Readonly<Record<GameType, GameDefinition>> = {
  flagflip: {
    type: 'flagflip',
    title: 'FlagFlip',
    question: '¿Cuál es su capital?',
    accentClass: 'accent-flag',
    items: COUNTRIES.map((c) => ({ id: c.id, name: c.name, answer: c.capital, image: c.flag })),
  },
  landflip: {
    type: 'landflip',
    title: 'LandFlip',
    question: '¿Qué lugar es este?',
    accentClass: 'accent-land',
    items: PLACES.map((p) => ({
      id: p.id,
      name: p.name,
      answer: p.name,
      image: p.image,
      location: p.location,
    })),
  },
};
