import { Scene } from 'phaser'

import { Health } from '../../classes/Health'
import { Score, scoreOperations } from '../../classes/Score'
import { Text } from '../../classes/Text'
import { EVENT_NAME, gameStatus, type GameStatus } from '../../constants'

export class DisplayScene extends Scene {
  private score!: Score
  private gameEndPhrase!: Text
  private health!: Health

  constructor() {
    super('display-scene')
  }

  create(): void {
    const graphics = this.add.graphics()
    graphics.fillStyle(0x000000, 0.5)
    graphics.fillRoundedRect(20, 20, 200, 40, 8)

    this.score = new Score(this, 28, 30, 0)
    this.health = new Health(this, 260, 20)
    this.initListeners()

    const gameStartPhrase = this.add.text(
      this.game.scale.width * 0.5,
      this.game.scale.height * 0.4,
      'Reach evacuation point',
      {
        fontSize: 'calc(100vw / 40)',
        color: '#fff',
        stroke: '#000',
        strokeThickness: 4,
        align: 'center',
      }
    )
    setTimeout(() => {
      gameStartPhrase.destroy()
    }, 2000)
  }

  gameEndHandler(status: GameStatus) {
    this.cameras.main.setBackgroundColor('rgba(0,0,0,0.6)')
    this.game.scene.pause('level-1-scene')

    this.gameEndPhrase = new Text(
      this,
      this.game.scale.width / 2,
      this.game.scale.height * 0.4,
      status === gameStatus.LOSE ? `WASTED!\nCLICK TO RESTART` : `YOU ARE ROCK!\nCLICK TO RESTART`
    )
      .setAlign('center')
      .setColor(status === gameStatus.LOSE ? '#ff0000' : '#ffffff')

    this.gameEndPhrase.setPosition(
      this.game.scale.width / 2 - this.gameEndPhrase.width / 2,
      this.game.scale.height * 0.4
    )

    this.input.on('pointerdown', () => {
      this.game.events.off(EVENT_NAME.takeBox, this.takeBoxHandler)
      this.game.events.off(EVENT_NAME.gameEnd, this.gameEndHandler)
      this.scene.get('level-1-scene').scene.restart()
      this.scene.restart()
    })
  }

  private takeBoxHandler() {
    this.score.changeValue(scoreOperations.INCREASE, 10)
  }

  private getDamageHandler(hp: number) {
    this.health.update(hp)
  }

  private initListeners(): void {
    this.game.events.on(EVENT_NAME.getDamage, this.getDamageHandler, this)
    this.game.events.on(EVENT_NAME.takeBox, this.takeBoxHandler, this)
    this.game.events.once(EVENT_NAME.gameEnd, this.gameEndHandler, this)
  }
}
