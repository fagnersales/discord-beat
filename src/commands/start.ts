import { Message, TextChannel, VoiceChannel } from "discord.js"
import { Studio } from "../structures/Studio"
import { audienceClient } from ".."

async function start(message: Message, args: string[]) {
  if (!message.member?.voice.channel) {
    return message.reply('Você precisa estar conectado num canal de voz.')
  }

  const VoiceChannel = message.member.voice.channel

  if (!VoiceChannel.joinable) {
    return message.reply('Não pude me conectar a este canal de voz!')
  } 

  const voiceConnection = await VoiceChannel.join()
  
  const audienceVoiceChannel = audienceClient.channels.cache.get(VoiceChannel.id) as VoiceChannel
  const audienceConnection = await audienceVoiceChannel.join()

  const studio = new Studio({
    dj: message.member,
    guild: message.member.guild,
    voiceChannel: VoiceChannel,
    connection: voiceConnection,
    audienceConnection: audienceConnection
  })

  await studio.createDesk(message.channel as TextChannel)

}

export default { exec: start }