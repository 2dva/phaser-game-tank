import { Text } from './Text'

export const scoreOperations = {
  INCREASE: 'INCREASE',
  DECREASE: 'DECREASE',
  SET_VALUE: 'SET_VALUE',
} as const

export type ScoreOperations =  typeof scoreOperations[keyof typeof scoreOperations]

export class Score extends Text {
  private scoreValue: number

  constructor(scene: Phaser.Scene, x: number, y: number, initScore = 0) {
    super(scene, x, y, `Score: ${initScore}`)

    scene.add.existing(this)

    this.scoreValue = initScore
  }

  public changeValue(operation: ScoreOperations, value: number): void {
    switch (operation) {
      case scoreOperations.INCREASE:
        this.scoreValue += value
        break
      case scoreOperations.DECREASE:
        this.scoreValue -= value
        break
      case scoreOperations.SET_VALUE:
        this.scoreValue = value
        break
      default:
        break
    }

    this.setText(`Score: ${this.scoreValue}`)
  }

  public getValue(): number {
    return this.scoreValue
  }
}
