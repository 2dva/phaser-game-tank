import { Scene, Tilemaps } from 'phaser'
import { Enemy } from '../../classes/Enemy'
import { Hero } from '../../classes/Hero'
import { EVENT_NAME } from '../../constants'
import { gameObjectsToObjectPoints } from '../../lib/helpers'

export class Level1Scene extends Scene {
  private hero!: Hero
  private enemies!: Enemy[]
  private map!: Tilemaps.Tilemap
  private tileset!: Tilemaps.Tileset
  private wallsLayer!: Tilemaps.TilemapLayer
  private boxes!: Phaser.GameObjects.Sprite[]
  private explosion!: Phaser.GameObjects.Sprite

  constructor() {
    super('level-1-scene')
  }

  create(): void {
    this.initMap()

    this.hero = new Hero(this, 300, 300)

    this.initBoxes()
    this.initEnemies()
    this.initCamera()

    this.hero.setPhysics(this.physics, this.wallsLayer, this.enemies)
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

  private initEnemies(): void {
    const enemiesPoints = gameObjectsToObjectPoints(
      this.map.filterObjects('Enemies', (obj) => obj.name === 'enemyPoint')!
    )

    this.enemies = enemiesPoints.map((enemyPoint) =>
      new Enemy(this, enemyPoint.x, enemyPoint.y, 'enemy1', this.hero).setName(enemyPoint.id.toString())
    )

    this.physics.add.collider(this.enemies, this.wallsLayer)
    this.physics.add.collider(this.enemies, this.enemies)
    this.physics.add.collider(this.hero, this.enemies, (obj1) => {
      ;(obj1 as Hero).getDamage(1)
    })
  }

  private initBoxes(): void {
    this.explosion = this.add.sprite(0, 0, '').setVisible(false)
    this.explosion.scale = 0.4

    this.anims.create({
      key: 'box_explode',
      frames: 'boom2',
      frameRate: 20,
      showOnStart: true,
      hideOnComplete: true,
    })

    const chestPoints = gameObjectsToObjectPoints(this.map.filterObjects('Boxes', (obj) => obj.name === 'BoxPoint')!)

    this.boxes = chestPoints.map((chestPoint) =>
      this.physics.add.sprite(chestPoint.x, chestPoint.y, 'sprite', 81).setScale(1.5)
    )

    this.boxes.forEach((chest) => {
      this.physics.add.overlap(this.hero, chest, (_obj1, obj2) => {
        this.game.events.emit(EVENT_NAME.takeBox)
        this.explosion.stop()
        this.explosion.copyPosition(obj2 as Phaser.Types.Math.Vector2Like).play('box_explode')

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
