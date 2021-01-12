import { Message } from "discord.js"

const prefix = ">>"

function validateMessageInput(message: Message): boolean {

  if (
    message.author.bot
    || !message.content
    || !message.content.startsWith(prefix)
    || !message.guild?.me?.permissions.has('SEND_MESSAGES')
  ) return false

  return true
}

export { validateMessageInput }