export interface Country {
  /** Stable slug, e.g. `paises-bajos`. */
  readonly id: string;
  readonly name: string;
  readonly capital: string;
  /** Path to the flag SVG inside `public/`. */
  readonly flag: string;
}
