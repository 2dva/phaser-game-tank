import { Actor } from './Actor'

const ROTATION_SPEED = Math.PI * 0.02

export class Hull extends Actor {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'tank')
    this.scale = 0.5

    this.initAnimations()
  }

  private initAnimations(): void {
    this.scene.anims.create({
      key: 'tank',
      frames: this.scene.anims.generateFrameNames('a-tank', {
        prefix: 'tank-',
        end: 5,
      }),
      frameRate: 40,
    })
  }

  update(velocity: Phaser.Math.Vector2): void {
    if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) {
      if (!this.anims.isPlaying) this.anims.play('tank', true)
      const target = new Phaser.Math.Vector2(velocity).angle() - Math.PI / 2
      this.rotate(target)
    }
  }

  rotate(target: number) {
    this.rotation = Phaser.Math.Angle.RotateTo(this.rotation, target, ROTATION_SPEED)
  }
}
