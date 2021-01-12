import Discord from 'discord.js'

import { validateMessageInput } from './structures/validateMessageInput'

import { commands, commandsName } from './structures/commands'


const client = new Discord.Client()

client.on('ready', () => console.log('I\'m ready!'))

const prefix = ">>"

client.on('message', message => {
  if (validateMessageInput(message)) {
    const commandName = message.content.trim().toLowerCase().slice(prefix.length).split(' ')[0]

    if (commandsName.includes(commandName)) {
      const args = message.content.slice(prefix.length).split(' ')
      if (commandName === 'start') commands['start'].exec(message, args)
    }
  }
})

client.login('Nzk4NTQ1MjA0NDY5Njk0NTI0.X_2lLA.25SzKT__JYkDsZYfpVjzRfdbp5o')