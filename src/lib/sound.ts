import { Howl } from 'howler'
import tapMp3 from '../assets/sound/tap.mp3'
// import { SETTING_NAME, Settings } from './settings'

// export const setupSoundOptions = () => {
//   let volume = parseInt(Settings.load(SETTING_NAME.SOUND_VOLUME) as string)
//   if (isNaN(volume)) {
//     volume = 10
//   }
//   Howler.volume(volume / 10)
// }

export const Sound = {
  tap: new Howl({
    src: tapMp3,
    volume: 0.1,
  }),
  mute: (off: boolean) => {
    Howler.mute(off)
  },
}
