import { Message } from "discord.js"

export type CommandsName = 'start' | 'stop'

export interface CommandInterface {
  exec: (message: Message, args: string[]) => Promise<void>;
}

export type Commands = {
  [CommandName in CommandsName]: CommandInterface
}