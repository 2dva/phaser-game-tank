import type { Tilemaps } from 'phaser'
import { Bullet } from './Bullet'

type PhysicsCallback = Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
type Body = Phaser.Tilemaps.Tile

export class Bullets extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene)

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
    // bullet.setActive(false)
    bullet.setVisible(false)
  }
}
