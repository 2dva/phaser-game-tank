import { Scene, Tilemaps } from 'phaser'
import { Hero } from '../../classes/Hero'

export class Level1 extends Scene {
  private hero!: Hero
  private map!: Tilemaps.Tilemap
  private tileset!: Tilemaps.Tileset
  private wallsLayer!: Tilemaps.TilemapLayer
  // private groundLayer!: Tilemaps.TilemapLayer

  constructor() {
    super('level-1-scene')
  }

  create(): void {
    this.initMap()

    this.hero = new Hero(this, 300, 300)
    this.hero.setPhysics(this.physics, this.wallsLayer)

  }

  update(_time: number, delta: number): void {
    const pointer = this.input.activePointer

    this.hero.update(pointer, delta)
  }

  private initMap(): void {
    this.map = this.make.tilemap({ key: 'field32', tileWidth: 16, tileHeight: 16 })
    this.tileset = this.map.addTilesetImage('field32', 'tiles')!
    this.map.createLayer('Ground', this.tileset, 0, 0)!
    this.wallsLayer = this.map.createLayer('Walls', this.tileset, 0, 0)!
    this.wallsLayer.setCollisionByProperty({ collides: true })
    this.physics.world.setBounds(0, 0, this.wallsLayer.width, this.wallsLayer.height)

    if (!!this.physics.world.debugGraphic) this.showDebugWalls()
  }

  private showDebugWalls(): void {
    const debugGraphics = this.add.graphics().setAlpha(0.7)
    this.wallsLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
    })
  }
}
