import { Scene } from 'phaser'

export class LoadingScene extends Scene {
  constructor() {
    super('loading-scene')
  }

  preload(): void {
    this.load.baseURL = 'assets/'

    this.load.image('tank', 'sprites/tank.png')
    this.load.image('turret', 'sprites/turret.png')
    this.load.atlas('a-tank', 'spritesheets/tanks.png', 'spritesheets/tanks_atlas.json')
  }

  create(): void {
    this.scene.start('level-1-scene')
  }
}
