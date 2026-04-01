import { Physics } from 'phaser'

export class Actor extends Physics.Arcade.Sprite {
  protected hp = 100

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.getBody().setCollideWorldBounds(true)
  }

  public getDamage(value: number = 0): void {
    this.hp = this.hp - value
    if (this.hp <= 0) {
      this.destroy()
      return
    }

    this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: 3,
      yoyo: true,
      alpha: 0.5,
      onStart: () => {},
      onComplete: () => {
        this.setAlpha(1)
      },
    })
  }

  public getHPValue(): number {
    return this.hp
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body
  }
}
