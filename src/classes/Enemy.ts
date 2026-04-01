import { Actor } from './Actor'
import { Hero } from './Hero'

const GROUND_SPEED = 80
const AGRESSOR_RADIUS = 200
const ROTATION_SPEED = Math.PI * 0.02

export class Enemy extends Actor {
  private target: Hero

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, target: Hero, frame?: string | number) {
    super(scene, x, y, texture, frame)
    this.target = target
    // this.setScale(0.8)

    // ADD TO SCENE
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // PHYSICS MODEL
    this.getBody().setSize(70, 50)
    this.getBody().setOffset(0, 0)
  }

  preUpdate(): void {
    if (
      Phaser.Math.Distance.BetweenPoints({ x: this.x, y: this.y }, { x: this.target.x, y: this.target.y }) <
      AGRESSOR_RADIUS
    ) {
      const vX = this.target.x - this.x
      const vY = this.target.y - this.y
      this.getBody().setVelocityX(Math.abs(vX) > GROUND_SPEED ? GROUND_SPEED * Math.sign(vX) : vX)
      this.getBody().setVelocityY(Math.abs(vY) > GROUND_SPEED ? GROUND_SPEED * Math.sign(vY) : vY)
    } else {
      this.getBody().setVelocity(0)
    }
    
    if (Math.abs(this.getBody().velocity.x) > 0.1 || Math.abs(this.getBody().velocity.y) > 0.1) {
      const target = new Phaser.Math.Vector2(this.getBody().velocity).angle()
      this.rotation = Phaser.Math.Angle.RotateTo(this.rotation, target, ROTATION_SPEED)
    }
  }

  public setTarget(target: Hero): void {
    this.target = target
  }
}
