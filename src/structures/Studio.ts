import { Guild, GuildMember, MessageEmbed, TextChannel, VoiceChannel, VoiceConnection } from "discord.js"
import { StudioDesk } from "./StudioDesk";

interface StudioConstructor {
  guild: Guild;
  dj: GuildMember;
  voiceChannel: VoiceChannel;
  connection: VoiceConnection;
  audienceConnection: VoiceConnection;
}

class Studio {
  public guild: Guild;
  public dj: GuildMember;
  public voiceChannel: VoiceChannel;
  public connection: VoiceConnection;
  public audienceConnection: VoiceConnection;

  constructor({ guild, dj, voiceChannel, connection, audienceConnection }: StudioConstructor) {
    this.guild = guild
    this.dj = dj
    this.voiceChannel = voiceChannel
    this.connection = connection
    this.audienceConnection = audienceConnection

  }

  async createDesk(channel: TextChannel) {
    new StudioDesk({
      connection: this.connection,
      audienceConnection: this.audienceConnection,
      dj: this.dj,
      message: (await channel.send(StudioDesk.DeskEmbed()))
    })
  }
}

export { Studio }