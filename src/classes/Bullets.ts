import type { Tilemaps } from 'phaser'
import { Bullet } from './Bullet'

type PhysicsCallback = Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
type Body = Phaser.Tilemaps.Tile

export class Bullets extends Phaser.Physics.Arcade.Group {
  private explosion!: Phaser.GameObjects.Sprite

  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene)
    this.explosion = scene.add.sprite(0, 0, '').setVisible(false)

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

  setPhysics(physics: Phaser.Physics.Arcade.ArcadePhysics, walls: Tilemaps.TilemapLayer) {
    physics.add.collider(this, walls, this.hitEnemy as PhysicsCallback, undefined, this)
  }

  fireBullet(x: number, y: number, angle: number) {
    const bullet = this.getFirstDead(true)

    if (bullet) {
      bullet.fire(x, y, angle)
    }
  }

  hitEnemy(bullet: Body, _enemy: Body) {
    this.explosion.copyPosition(bullet).play('explode')
    // bullet.setActive(false)
    bullet.setVisible(false)
    bullet.destroy()
  }
}
