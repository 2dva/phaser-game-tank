import { Scene } from 'phaser'
import { Hero } from '../../classes/_Hero'

export class Level1 extends Scene {
  private hero!: Hero

  constructor() {
    super('level-1-scene')
  }

  create(): void {
    this.hero = new Hero(this, 300, 300)
  }

  update(_time: number, delta: number): void {
    const pointer = this.input.activePointer

    this.hero.update(pointer, delta)
  }
}
