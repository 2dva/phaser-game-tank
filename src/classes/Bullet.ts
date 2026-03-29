const SPEED = 1000

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bullet')
  }

  fire(x: number, y: number, angle: number) {
    this.body!.reset(x, y)

    this.setActive(true)
    this.setVisible(true)
    
    this.setVelocity(Math.cos(angle) * SPEED, Math.sin(angle) * SPEED)
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)

    if (this.y <= -32) {
      this.setActive(false)
      this.setVisible(false)
    }
  }
}
