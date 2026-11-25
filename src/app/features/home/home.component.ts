import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { COUNTRIES } from '../../core/data/countries.data';
import { PLACES } from '../../core/data/places.data';
import { GameType } from '../../core/models/game-type.model';
import { ScoreStorageService } from '../../core/services/score-storage.service';

interface FanImage {
  readonly src: string;
  readonly alt: string;
}

interface DeckOption {
  readonly type: GameType;
  readonly title: string;
  readonly description: string;
  readonly count: string;
  readonly cardClass: string;
  readonly fan: readonly FanImage[];
  readonly best: number;
}

function pick<T extends { id: string }>(items: readonly T[], ids: readonly string[]): T[] {
  return ids.map((id) => {
    const found = items.find((item) => item.id === id);
    if (!found) throw new Error(`Unknown id: ${id}`);
    return found;
  });
}

@Component({
  selector: 'app-home',
  imports: [MatButton, RouterLink],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly scores = inject(ScoreStorageService);

  /** Transform of each mini card in the fan (closed / open on hover). */
  protected readonly fanClasses = [
    '[transform:rotate(-14deg)_translateX(-70px)] group-hover:[transform:rotate(-18deg)_translateX(-90px)] group-focus-within:[transform:rotate(-18deg)_translateX(-90px)]',
    '[transform:translateY(-8px)]',
    '[transform:rotate(14deg)_translateX(70px)] group-hover:[transform:rotate(18deg)_translateX(90px)] group-focus-within:[transform:rotate(18deg)_translateX(90px)]',
  ] as const;

  protected readonly decks: readonly DeckOption[] = [
    {
      type: 'flagflip',
      title: 'FlagFlip',
      description:
        'Te mostramos la bandera y el nombre de un país. Elige su capital entre tres opciones.',
      count: `${COUNTRIES.length} países`,
      cardClass: 'bg-flag',
      fan: pick(COUNTRIES, ['japon', 'brasil', 'francia']).map((c) => ({
        src: c.flag,
        alt: `Bandera de ${c.name}`,
      })),
      best: this.scores.best('flagflip'),
    },
    {
      type: 'landflip',
      title: 'LandFlip',
      description: 'Mira la ilustración de un lugar emblemático del mundo y adivina cuál es.',
      count: `${PLACES.length} lugares`,
      cardClass: 'bg-land',
      fan: pick(PLACES, ['coliseo', 'torre-eiffel', 'monte-fuji']).map((p) => ({
        src: p.image,
        alt: `Ilustración de ${p.name}`,
      })),
      best: this.scores.best('landflip'),
    },
  ];
}
