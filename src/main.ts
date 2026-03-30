import { Game, type Types } from 'phaser'
import { Level1, LoadingScene } from './scenes'
import * as _css from './style.css'

const DEBUG = false

const gameConfig: Types.Core.GameConfig = {
  title: 'Phaser game tutorial',
  type: Phaser.WEBGL,
  parent: 'game',
  backgroundColor: '#351f1b',
  scale: {
    mode: Phaser.Scale.ScaleModes.NONE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: DEBUG,
    },
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
  callbacks: {
    postBoot: () => {
      window.sizeChanged()
    },
  },
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  autoFocus: true,
  audio: {
    disableWebAudio: false,
  },
  scene: [LoadingScene, Level1],
}

window.sizeChanged = () => {
  if (window.game.isBooted) {
    setTimeout(() => {
      window.game.scale.resize(window.innerWidth, window.innerHeight)

      window.game.canvas.setAttribute(
        'style',
        `display: block; width: ${window.innerWidth - 20}px; height: ${window.innerHeight - 20}px;`
      )
    }, 100)
  }
}

window.onresize = () => window.sizeChanged()

window.game = new Game(gameConfig)
