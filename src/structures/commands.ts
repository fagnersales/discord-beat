import { Commands } from '../types'

// Commands
import start from '../commands/start'
import stop from '../commands/stop'

const commands: Commands = {
  start,
  stop
}

const commandsName: string[] = ['start']

export { commands, commandsName }