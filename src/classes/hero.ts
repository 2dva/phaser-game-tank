import { Hull } from './hull'

const ROTATION_SPEED = Math.PI * 0.0008
let target = 0

export class Hero extends Phaser.GameObjects.Container {
  private keyW: Phaser.Input.Keyboard.Key
  private keyA: Phaser.Input.Keyboard.Key
  private keyS: Phaser.Input.Keyboard.Key
  private keyD: Phaser.Input.Keyboard.Key
  private hull: Hull
  private turret: Phaser.GameObjects.Sprite

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.hull = new Hull(scene, 0, 0)
    this.add(this.hull)
    this.turret = scene.add.sprite(0, -5, 'turret')
    this.turret.scale = 0.5
    this.turret.setOrigin(0.5, 0.25)
    this.add([this.hull, this.turret])

    // KEYS
    this.keyW = this.scene.input.keyboard!.addKey('W')
    this.keyA = this.scene.input.keyboard!.addKey('A')
    this.keyS = this.scene.input.keyboard!.addKey('S')
    this.keyD = this.scene.input.keyboard!.addKey('D')
  }

  update(pointer: Phaser.Input.Pointer, delta: number): void {
      const angleToPointer = Phaser.Math.Angle.BetweenPoints(this, pointer)
      target = angleToPointer - Math.PI / 2

    let hDir = null,
      vDir = null

    this.body!.velocity.x = 0
    this.body!.velocity.y = 0

    if (this.keyW?.isDown) {
      vDir = true
      this.body!.velocity.y = -110
    }

    if (this.keyA?.isDown) {
      hDir = false
      this.body!.velocity.x = -110
    }

    if (this.keyS?.isDown) {
      vDir = false
      this.body!.velocity.y = 110
    }

    if (this.keyD?.isDown) {
      hDir = true
      this.body!.velocity.x = 110
    }
    this.hull.update(hDir, vDir)

    if (target < -Math.PI) target += 2 * Math.PI
    this.turret.rotation = Phaser.Math.Angle.RotateTo(this.turret.rotation, target, ROTATION_SPEED * delta)
  }
}
