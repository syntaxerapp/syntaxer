import { SyntaxerPlugin } from '../../src/index'
// import { SyntaxerPlugin } from 'syntaxer'

class NodePlugin extends SyntaxerPlugin {
    static len = 2
    static commands = {
        'npm': ['npm', 'install'],
        'yarn': ['yarn', 'add'],
        'pnpm': ['pnpm', 'install'] //если какой-то команды нет, то написать вместо неё в этом списке nocmd и тогда в сгенерированном html оставить команду как есть и добавить подпись, что сконверировать нельзя
    }
    convertCommand(text: string): string {
        const userChoice: string = this.options.userChoice
        for (const key in NodePlugin.commands) {
            if (text.includes(key)) {
                let out = ''
                const textArray = text.split(' ')
                for (let i = 0; i < NodePlugin.len; i++) {
                     out += NodePlugin.commands[userChoice as keyof typeof NodePlugin.commands][i] + ' '
                }
                out += textArray.slice(NodePlugin.len)
                return out
            }
        }
        return text
    }
}

export default NodePlugin