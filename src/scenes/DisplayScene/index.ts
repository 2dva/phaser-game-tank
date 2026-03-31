import { Scene } from 'phaser'

import { Score, scoreOperations } from '../../classes/Score'
import { EVENT_NAME } from '../../events'

export class DisplayScene extends Scene {
  private score!: Score

  constructor() {
    super('display-scene')
  }

  create(): void {
    this.score = new Score(this, 20, 20, 0)
    this.initListeners()
  }

  private takeBoxHandler() {
    this.score.changeValue(scoreOperations.INCREASE, 10)
  }

  private initListeners(): void {
    this.game.events.on(EVENT_NAME.takeBox, this.takeBoxHandler, this)
  }
}
