export const GAME_TYPES = ['flagflip', 'landflip'] as const;

export type GameType = (typeof GAME_TYPES)[number];

export function isGameType(value: unknown): value is GameType {
  return typeof value === 'string' && (GAME_TYPES as readonly string[]).includes(value);
}
