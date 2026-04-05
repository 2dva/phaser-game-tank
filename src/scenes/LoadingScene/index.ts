import { Scene } from 'phaser'

export class LoadingScene extends Scene {
  constructor() {
    super('loading-scene')
  }

  preload(): void {
    this.load.baseURL = 'assets/'

    this.load.spritesheet('sprite', 'tilemaps/tiles/textures32.png', {
      frameWidth: 32,
      frameHeight: 32,
    })

    this.load.image('bullet', 'sprites/bullet3.png')
    this.load.image('tank', 'sprites/tank.png')
    this.load.image('enemy1', 'sprites/enemy1.png')
    this.load.image('enemy2', 'sprites/enemy2.png')
    this.load.image('turret', 'sprites/turret.png')
    this.load.atlas('a-tank', 'spritesheets/tanks.png', 'spritesheets/tanks_atlas.json')
    this.load.spritesheet('boom2', 'spritesheets/explosion2.png', { frameWidth: 256, frameHeight: 256, endFrame: 7 })
    this.load.spritesheet('boom5', 'spritesheets/explosion5.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('boom6', 'spritesheets/explosion6.png', { frameWidth: 48, frameHeight: 48 })

    this.load.image({
      key: 'tiles',
      url: 'tilemaps/tiles/textures32.png',
    })
    this.load.tilemapTiledJSON('field32', 'tilemaps/json/field32.json')
  }

  create(): void {
    this.scene.start('level-1-scene')
    this.scene.start('display-scene')
  }
}
