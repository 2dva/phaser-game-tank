export const gameStatus = {
  WIN: 'WIN',
  LOSE: 'LOSE',
}

export type GameStatus = keyof typeof gameStatus

export const EVENT_NAME = {
  getDamage: 'get-damage',
  takeBox: 'take-box',
  gameEnd: 'game-end',
}
