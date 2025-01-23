import { SyntaxerPlugin } from '../../src/index'
// import { SyntaxerPlugin } from 'syntaxer'

class NodePlugin extends SyntaxerPlugin {
  static len = 2
  static commands = {
    npm: [
      'npm',
      'install -g',
      'install',
      'start',
      'uninstall',
      '--save-dev',
      'update',
      'view',
    ],
    yarn: [
      'yarn',
      'global add',
      'add',
      'run',
      'remove',
      '--dev',
      'upgrade',
      'info',
    ],
    pnpm: [
      'pnpm',
      'install --global',
      'install',
      'start',
      'uninstall',
      '--save-dev',
      'update',
      'info',
    ], //если какой-то команды нет, то написать вместо неё в этом списке nocmd и тогда в сгенерированном html оставить команду как есть и добавить подпись, что сконверировать нельзя
  }
  convertCommand(text: string): string {
    const userChoice: string = this.options.userChoice
    for (let key in NodePlugin.commands) {
      if (text.includes(key)) {
        let out = text
        for (let i in NodePlugin.commands[key as keyof typeof NodePlugin.commands]) {
          const searchValue = NodePlugin.commands[key as keyof typeof NodePlugin.commands][i]
          const replaceValue = NodePlugin.commands[userChoice as keyof typeof NodePlugin.commands][i]
          out = out.replace(searchValue, replaceValue)
        }
        return out
      }
    }
    return text
  }
}

export default NodePlugin
