const SCALE_LENGTH = 190

export class Health extends Phaser.GameObjects.Container {
  private health = 0
  private scaleObj: Phaser.GameObjects.Graphics

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    scene.add.existing(this)

    const bg = scene.add.graphics()
    bg.fillStyle(0x000000, 0.4)
    bg.fillRoundedRect(0, 0, 200, 40, 5)
    this.add(bg)

    this.scaleObj = scene.add.graphics()
    this.add([bg, this.scaleObj])

    this.update(100)
  }

  update(health: number) {
    if (this.health !== health) {
      this.health = Math.min(health, 100)
      this.scaleObj.clear()
      if (this.health > 5) {
        // small hp rectangle render bug
        this.scaleObj.fillStyle(0x01c929, 0.8)
        this.scaleObj.fillRoundedRect(5, 5, Math.round((SCALE_LENGTH / 100) * this.health), 30, 5)
      }
    }
  }
}
