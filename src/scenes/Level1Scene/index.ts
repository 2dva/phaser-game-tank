import { Scene, Tilemaps } from 'phaser'
import { Hero } from '../../classes/Hero'
import { gameObjectsToObjectPoints } from '../../lib/helpers'
import { EVENT_NAME } from '../../events'

export class Level1Scene extends Scene {
  private hero!: Hero
  private map!: Tilemaps.Tilemap
  private tileset!: Tilemaps.Tileset
  private wallsLayer!: Tilemaps.TilemapLayer
  // private groundLayer!: Tilemaps.TilemapLayer
  private boxes!: Phaser.GameObjects.Sprite[]

  constructor() {
    super('level-1-scene')
  }

  create(): void {
    this.initMap()

    this.hero = new Hero(this, 300, 300)
    this.hero.setPhysics(this.physics, this.wallsLayer)

    this.initBoxes()
    this.initCamera()
  }

  update(_time: number, delta: number): void {
    const pointer = this.input.activePointer

    this.hero.update(pointer, this.cameras.main, delta)
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

  private initBoxes(): void {
    const chestPoints = gameObjectsToObjectPoints(this.map.filterObjects('Boxes', (obj) => obj.name === 'BoxPoint')!)

    this.boxes = chestPoints.map((chestPoint) =>
      this.physics.add.sprite(chestPoint.x, chestPoint.y, 'sprite', 81).setScale(1.5)
    )

    this.boxes.forEach((chest) => {
      this.physics.add.overlap(this.hero, chest, (_obj1, obj2) => {
        this.game.events.emit(EVENT_NAME.takeBox)
        obj2.destroy()
        // this.cameras.main.flash()
      })
    })
  }

  private initCamera(): void {
    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height)
    this.cameras.main.startFollow(this.hero, true, 0.1, 0.1)
    this.cameras.main.setDeadzone(120, 120) 
    this.cameras.main.setZoom(1.1)
  }
}
