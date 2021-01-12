import { EventEmitter } from "events"

class StudioState extends EventEmitter {
  public playing: boolean;
  public song: string | null;

  constructor() {
    super()
    this.playing = false
    this.song = null
  }

  togglePlaying() {
    this.playing = !this.playing
    return this
  }

  setSong(song: string | null) {
    this.song = song
    return this
  }

  update() {
    this.emit('change')
  }
}

export { StudioState }