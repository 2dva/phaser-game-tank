import { Physics } from 'phaser'

export class Turret extends Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    scene.add.existing(this)
    scene.physics.add.existing(this)
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body
  }

  public update(pointer: Phaser.Input.Pointer): void {
    // Calculate angle in radians
    let angle = Phaser.Math.Angle.BetweenPoints(this, pointer)
    if (angle > Math.PI) angle -= 2 * Math.PI

    // Apply rotation
    this.rotation = angle
  }
}
