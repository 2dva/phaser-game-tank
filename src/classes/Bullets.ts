import { Bullet } from './Bullet'
import { Enemy } from './Enemy'

type PhysicsCallback = Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
type Body = Phaser.Tilemaps.Tile

const DEFAULT_SPEED = 1000
const DEFAULT_IMPACT = 30

export class Bullets extends Phaser.Physics.Arcade.Group {
  private explosion!: Phaser.GameObjects.Sprite
  private impact: number
  private speed: number

  constructor(scene: Phaser.Scene, impact = DEFAULT_IMPACT, speed = DEFAULT_SPEED) {
    super(scene.physics.world, scene)
    this.explosion = scene.add.sprite(0, 0, '').setVisible(false)
    this.impact = impact
    this.speed = speed

    scene.anims.create({
      key: 'explode',
      frames: 'boom5',
      frameRate: 20,
      showOnStart: true,
      hideOnComplete: true,
    })

    this.createMultiple({
      frameQuantity: 5,
      key: 'bullet',
      active: false,
      visible: false,
      classType: Bullet,
    })
  }

  setPhysicsWall(
    physics: Phaser.Physics.Arcade.ArcadePhysics,
    obstacle: Phaser.Types.Physics.Arcade.ArcadeColliderType
  ) {
    physics.add.collider(this, obstacle, this.hitWall as PhysicsCallback, undefined, this)
  }

  setPhysicsEnemy(
    physics: Phaser.Physics.Arcade.ArcadePhysics,
    obstacle: Phaser.Types.Physics.Arcade.ArcadeColliderType
  ) {
    physics.add.collider(this, obstacle, this.hitEnemy as PhysicsCallback, undefined, this)
  }

  fireBullet(x: number, y: number, angle: number) {
    const bullet = this.getFirstDead(true)

    if (bullet) {
      bullet.fire(x, y, angle, this.speed)
    }
  }

  hitWall(bullet: Body) {
    this.explosion.copyPosition(bullet).play('explode')
    bullet.setVisible(false)
    bullet.destroy()
  }

  hitEnemy(enemy: Enemy, bullet: Body) {
    this.explosion.copyPosition(bullet).play('explode')
    enemy.getDamage(this.impact)
    bullet.setVisible(false)
    bullet.destroy()
  }
}
