import { GuildMember, Message, MessageReaction, MessageEmbed, User, VoiceConnection } from "discord.js"
import { StudioState } from './StudioState'

interface StudioDeskConstructor {
  message: Message;
  dj: GuildMember;
  connection: VoiceConnection;
  audienceConnection: VoiceConnection;
}

const buttons = {
  play: '▶️',
  pause: '⏸️',
  rewind: '⏪',
  repeat: '🔁',
  hype: '🤘'
}

class StudioDesk {
  public message: Message
  public connection: VoiceConnection
  public audienceConnection: VoiceConnection
  public state: StudioState
  public dj: GuildMember

  constructor({ message, dj, connection, audienceConnection }: StudioDeskConstructor) {

    this.state = new StudioState()
    this.connection = connection
    this.audienceConnection = audienceConnection
    this.message = message
    this.dj = dj

    const filter = (reaction: MessageReaction, user: User) => {
      return Object.values(buttons).includes(reaction.emoji.name) && user.id === dj.id
    }

    message.react(buttons.play)

    message.createReactionCollector(filter, { max: 0, time: 0 })
      .on('collect', reaction => {
        if (reaction.emoji.name === buttons.play) this.startBeat()
        if (reaction.emoji.name === buttons.pause) this.pauseBeat()
        if (reaction.emoji.name === buttons.rewind) this.rewindBeat()
        if (reaction.emoji.name === buttons.hype) this.hypeBeat()
      })

    this.state.on('change', () => {
      message.edit(StudioDesk.DeskEmbed(this.state))
    })
  }

  async startBeat(): Promise<void> {
    this.connection.play('beat-jaya.mp3')

    await this.message.reactions.removeAll()

    Promise.all([buttons.rewind, buttons.pause, buttons.repeat, buttons.hype].map(button => this.message.react(button)))

    this.state
      .togglePlaying()
      .setSong('beat-jaya.mp3')
      .update()
  }

  async pauseBeat() {

    this.state.playing
      ? this.connection.dispatcher.pause(true)
      : this.connection.dispatcher.resume()

    const pauseButton = this.message.reactions.cache.find(reaction => reaction.emoji.name === buttons.pause)

    if (pauseButton) await pauseButton.users.remove(this.dj.id)

    this.state
      .togglePlaying()
      .update()

  }

  async rewindBeat() {
    if (this.state.playing && this.state.song) {
      const rewindButton = this.message.reactions.cache.find(reaction => reaction.emoji.name === buttons.rewind)
      if (rewindButton) await rewindButton.users.remove(this.dj.id)

      this.connection.dispatcher.destroy()
      const startAgain = () => this.connection.play(this.state.song as string)
      setTimeout(startAgain, 1000)
    }
  }

  async hypeBeat() {
    if (this.state.playing && this.state.song) {
      const hypeButton = this.message.reactions.cache.find(reaction => reaction.emoji.name === buttons.hype)
      if (hypeButton) await hypeButton.users.remove(this.dj.id)
      this.audienceConnection.play('woow.mp3')
    }
  }

  static DeskEmbed(data?: DeskEmbedData | StudioState) {
    const embed = new MessageEmbed()
      .setColor('RANDOM')
      .setDescription(StudioDesk.DeskEmbedDescription(data))

    return embed
  }

  static DeskEmbedDescription(data: DeskEmbedData | StudioState = {}): string {

    if (!data.playing && data.song) {
      return `**${data.song}** pausado, clique ${buttons.pause} para voltar!`
    }

    if (!data.playing || !data.song) {
      return ` ${buttons.play} \`Nada tocando no momento, que tal começar um beat?!\``
    }

    return `**Tocando:** ${data.song ?? 'Música desconhecida...'}`
  }
}

interface DeskEmbedData {
  playing?: boolean;
  song?: string;
}

export { StudioDesk }