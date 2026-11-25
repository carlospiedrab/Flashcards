export interface Place {
  /** Stable slug, e.g. `torre-eiffel`. */
  readonly id: string;
  readonly name: string;
  /** Human readable location, e.g. `París, Francia`. */
  readonly location: string;
  /** Path to the illustration SVG inside `public/`. */
  readonly image: string;
}
