import { SyntaxerPlugin } from '../../src/index'
// import { SyntaxerPlugin } from 'syntaxer'

class NodePlugin extends SyntaxerPlugin {
    static commands = {
        'npm': ['npm', 'install'],
        'yarn': ['yarn', 'add']
    }
    convertCommand(text: string): string {
        const userChoice: string = this.options.userChoice
        for (const key in NodePlugin.commands) {
            if (text.includes(key)) {
                let out = ''
                const textArray = text.split(' ')
                for (let i = 0; i < NodePlugin.commands[userChoice as keyof typeof NodePlugin.commands].length; i++) {
                     out += NodePlugin.commands[userChoice as keyof typeof NodePlugin.commands][i] + ' '
                }
                out += textArray.slice(NodePlugin.commands[userChoice as keyof typeof NodePlugin.commands].length)
                return out
            }
        }
        return text
    }
}

export default NodePlugin