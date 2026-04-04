import type { Physics, Tilemaps } from 'phaser'
import { EVENT_NAME, gameStatus } from '../constants'
import { Sound } from '../lib/sound'
import { Bullets } from './Bullets'
import type { Enemy } from './Enemy'
import { Hull } from './Hull'
import { Turret } from './Turret'

const ROTATION_SPEED = Math.PI * 0.0008
const GROUND_SPEED = 120

export class Hero extends Phaser.GameObjects.Container {
  protected hp = 100
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
    this.turret = new Turret(scene, 0, -5)

    this.add([this.hull, this.turret])

    scene.input.on('pointerdown', this.fire, this)

    // KEYS
    this.keyW = this.scene.input.keyboard!.addKey('W')
    this.keyA = this.scene.input.keyboard!.addKey('A')
    this.keyS = this.scene.input.keyboard!.addKey('S')
    this.keyD = this.scene.input.keyboard!.addKey('D')
  }

  fire() {
    const angle = this.turret.rotation + Math.PI / 2
    const x = this.x + 40 * Math.cos(angle)
    const y = this.y + 40 * Math.sin(angle) - 5
    this.bullets.fireBullet(x, y, angle)
    Sound.tap.play()
  }

  setPhysics(physics: Phaser.Physics.Arcade.ArcadePhysics, walls: Tilemaps.TilemapLayer, enemies: Enemy[]) {
    physics.add.collider(this, walls)
    this.bullets.setPhysicsWall(physics, walls) // Tilemaps.TilemapLayer
    this.bullets.setPhysicsEnemy(physics, enemies)
  }

  public getDamage(value: number = 0): void {
    this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: 3,
      yoyo: true,
      alpha: 0.5,
      onStart: () => {
        this.hp = this.hp - value
        this.scene.game.events.emit(EVENT_NAME.getDamage, this.hp)

        if (this.hp <= 0) {
          this.scene.game.events.emit(EVENT_NAME.gameEnd, gameStatus.LOSE)
        }
      },
      onComplete: () => {
        this.setAlpha(1)
      },
    })
  }

  update(pointer: Phaser.Input.Pointer, camera: Phaser.Cameras.Scene2D.Camera, delta: number): void {
    let vx = 0, vy = 0 // prettier-ignore
    if (this.keyW?.isDown) vy = -GROUND_SPEED
    if (this.keyA?.isDown) vx = -GROUND_SPEED
    if (this.keyS?.isDown) vy = GROUND_SPEED
    if (this.keyD?.isDown) vx = GROUND_SPEED
    this.getBody().setVelocity(vx, vy)

    this.hull.update(this.getBody().velocity)
    if (this.x > 2900 && this.y > 2900) {
          this.scene.game.events.emit(EVENT_NAME.gameEnd, gameStatus.WIN)
    }
    
    const angleToPointer = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      camera.scrollX + pointer.x,
      camera.scrollY + pointer.y
    )
    let target = angleToPointer - Math.PI / 2
    if (target < -Math.PI) target += 2 * Math.PI
    this.turret.rotation = Phaser.Math.Angle.RotateTo(this.turret.rotation, target, ROTATION_SPEED * delta)
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body
  }
}
