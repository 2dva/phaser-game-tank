import type { Physics, Tilemaps } from 'phaser'
import { Hull } from './_Hull'
import { Bullets } from './Bullets'

const ROTATION_SPEED = Math.PI * 0.0008
let target = 0

export class Hero extends Phaser.GameObjects.Container {
  private keyW: Phaser.Input.Keyboard.Key
  private keyA: Phaser.Input.Keyboard.Key
  private keyS: Phaser.Input.Keyboard.Key
  private keyD: Phaser.Input.Keyboard.Key
  private hull: Hull
  private bullets: Bullets
  private turret: Phaser.GameObjects.Sprite

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.getBody().setSize(74, 81)
    this.getBody().setOffset(-38, -40)
    this.getBody().debugBodyColor = 0x0000ff

    this.bullets = new Bullets(scene)

    this.hull = new Hull(scene, 0, 0)
    this.turret = scene.add.sprite(0, -5, 'turret')
    this.turret.scale = 0.5
    this.turret.setOrigin(0.5, 0.25)
    this.add([this.hull, this.turret])

    scene.input.on('pointerdown', () => {
      const angle = this.turret.rotation + Math.PI / 2
      const x = this.x + 40 * Math.cos(angle)
      const y = this.y + 40 * Math.sin(angle) - 5
      this.bullets.fireBullet(x, y, angle)
    })

    // KEYS
    this.keyW = this.scene.input.keyboard!.addKey('W')
    this.keyA = this.scene.input.keyboard!.addKey('A')
    this.keyS = this.scene.input.keyboard!.addKey('S')
    this.keyD = this.scene.input.keyboard!.addKey('D')
  }

  setPhysics(physics: Phaser.Physics.Arcade.ArcadePhysics, walls: Tilemaps.TilemapLayer) {
    physics.add.collider(this, walls)
    this.bullets.setPhysics(physics, walls)
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

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body
  }
}
