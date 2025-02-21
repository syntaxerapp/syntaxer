import { SyntaxerPlugin } from '../../src/index'
// import { SyntaxerPlugin } from 'syntaxer'

class Packager extends SyntaxerPlugin {
  static len = 4
  static commands = {
    'apt': [
      'apt',
      'install',
      'remove',
      'full-upgrade',
      'update',
      'upgrade',
      'autoremove',
      'search',
    ],
    'apt-get': [
      'apt-get',
      'install',
      'remove',
      'dist-upgrade',
      'update',
      'upgrade',
      'autoremove',
      'search',
    ],
    'dnf': [
      'dnf',
      'install',
      'remove',
      'distro-sync',
      'update',
      'upgrade',
      'autoremove',
      'search',
    ],
    'pacman': [
      'pacman',
      '-S',
      '-R',
      '-Syu',
      '-Sy',
      '-Syu',
      '-Rs',
      '-Ss',
    ],
  }
  convertCommand(text: string): string {
    const userChoice: string = this.options.userChoice
    for (let key in Packager.commands) {
      if (text.includes(key)) {
        let out = text
        for (let i in Packager.commands[key as keyof typeof Packager.commands]) {
          const searchValue = Packager.commands[key as keyof typeof Packager.commands][i]
          const replaceValue = Packager.commands[userChoice as keyof typeof Packager.commands][i]
          out = out.replace(searchValue + ' ', replaceValue + ' ')
        }
        return out
      }
    }
    return text
  }
}

export default Packager
