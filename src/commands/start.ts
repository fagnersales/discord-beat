import { Message } from "discord.js"

async function start(message: Message, args: string[]) {
  message.reply('Olá!')
}

export default { exec: start }