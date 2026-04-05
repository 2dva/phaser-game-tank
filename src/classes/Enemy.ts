import type { Tilemaps } from 'phaser'
import { Sound } from '../lib/sound'
import { Actor } from './Actor'
import { Bullets } from './Bullets'
import { Hero } from './Hero'

const ROTATION_SPEED = Math.PI * 0.02

export const ENEMY_TYPE = {
  INFANTRY: 'infantry',
  ARTILLERY: 'artillery',
}

export type EnemyType = (typeof ENEMY_TYPE)[keyof typeof ENEMY_TYPE]
type EnemyConfig = {
  texture: string
  groundSpeed: number
  agressorRadius: number
  tooCloseRadius: number
  canShoot: boolean
}

const enemyConfig: Record<EnemyType, EnemyConfig> = {
  infantry: {
    texture: 'enemy1',
    groundSpeed: 80,
    agressorRadius: 200,
    tooCloseRadius: 0,
    canShoot: false,
  },
  artillery: {
    texture: 'enemy2',
    groundSpeed: 60,
    agressorRadius: 400,
    tooCloseRadius: 150,
    canShoot: true,
  },
}

export class Enemy extends Actor {
  private target: Hero
  private config: EnemyConfig
  private bullets: Bullets
  private pursuit = false
  private lastShot = Date.now()

  constructor(scene: Phaser.Scene, x: number, y: number, type: EnemyType, target: Hero, frame?: string | number) {
    const config = enemyConfig[type]
    super(scene, x, y, config.texture, frame)
    this.target = target
    this.config = config
    this.bullets = new Bullets(scene, 30, 350)

    // ADD TO SCENE
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // PHYSICS MODEL
    this.getBody().setSize(70, 50)
    this.getBody().setOffset(0, 0)
  }

  fire() {
    const angleToTarget = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y)
    const x = this.x + 20 * Math.cos(angleToTarget)
    const y = this.y + 20 * Math.sin(angleToTarget)

    if (Math.abs(angleToTarget - this.rotation) < 0.15) {
      this.lastShot = Date.now()
      this.bullets.fireBullet(x, y, angleToTarget)
      Sound.tap.play()
    }
  }

  setPhysics(physics: Phaser.Physics.Arcade.ArcadePhysics, walls: Tilemaps.TilemapLayer, hero: Hero) {
    physics.add.collider(this, walls)
    this.bullets.setPhysicsWall(physics, walls)
    this.bullets.setPhysicsEnemy(physics, hero)
  }

  preUpdate(): void {
    const distanceToTarget = Phaser.Math.Distance.BetweenPoints(
      { x: this.x, y: this.y },
      { x: this.target.x, y: this.target.y }
    )
    this.pursuit = distanceToTarget < this.config.agressorRadius
    if (this.pursuit) {
      if (distanceToTarget >= this.config.tooCloseRadius) {
        const vX = this.target.x - this.x
        const vY = this.target.y - this.y
        this.getBody().setVelocityX(
          Math.abs(vX) > this.config.groundSpeed ? this.config.groundSpeed * Math.sign(vX) : vX
        )
        this.getBody().setVelocityY(
          Math.abs(vY) > this.config.groundSpeed ? this.config.groundSpeed * Math.sign(vY) : vY
        )
        const targetAngle = new Phaser.Math.Vector2(this.getBody().velocity).angle()
        this.rotation = Phaser.Math.Angle.RotateTo(this.rotation, targetAngle, ROTATION_SPEED)
      } else {
        this.getBody().setVelocity(0)
        const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y)
        this.rotation = Phaser.Math.Angle.RotateTo(this.rotation, targetAngle, ROTATION_SPEED)
      }

      if (this.config.canShoot && (Date.now() - this.lastShot) / 1000 > 4) {
        this.fire()
      }
    } else {
      this.getBody().setVelocity(0)
    }
  }

  public setTarget(target: Hero): void {
    this.target = target
  }
}
