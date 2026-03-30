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

  update(hDir: null | boolean, vDir: null | boolean): void {
    if (hDir !== null || vDir !== null) {
      if (!this.anims.isPlaying) this.anims.play('tank', true)
      this.rotate(hDir, vDir)
    }
  }

  rotate(hDir: null | boolean, vDir: null | boolean) {
    let angle = vDir ? 180 : 0
    const extraAngle = vDir === null ? 0 : vDir ? -45 : 45

    if (hDir === true) angle = 270 + extraAngle
    else if (hDir === false) angle = 90 - extraAngle

    let target = (angle / 360) * 2 * Math.PI
    if (target > Math.PI) target -= 2 * Math.PI
    this.rotation = Phaser.Math.Angle.RotateTo(this.rotation, target, ROTATION_SPEED)
  }
}
