import { Physics } from 'phaser'

export class Turret extends Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'turret')

    scene.add.existing(this)
    this.scale = 0.5
    this.setOrigin(0.5, 0.25)
  }
}
