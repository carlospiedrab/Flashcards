/**
 * Game-agnostic view of a deck item. FlagFlip and LandFlip map their data
 * (countries / places) to this shape so the game logic can be shared.
 */
export interface GameItem {
  /** Stable slug of the source country / place. */
  readonly id: string;
  /** Country name (FlagFlip) or place name (LandFlip). */
  readonly name: string;
  /** Text of the correct option: a capital (FlagFlip) or a place name (LandFlip). */
  readonly answer: string;
  /** Path to the image (flag or illustration) inside `public/`. */
  readonly image: string;
  /** Place location (LandFlip only). */
  readonly location?: string;
}

export interface GameCard {
  readonly item: GameItem;
  /** Three unique options in random order; exactly one equals `item.answer`. */
  readonly options: readonly string[];
}
