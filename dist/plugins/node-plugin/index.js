"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../src/index");
// import { SyntaxerPlugin } from 'syntaxer'
class NodePlugin extends index_1.SyntaxerPlugin {
    static len = 2;
    static commands = {
        'npm': ['npm', 'install'],
        'yarn': ['yarn', 'add'],
        'pnpm': ['pnpm', 'install'] //если какой-то команды нет, то написать вместо неё в этом списке nocmd и тогда в сгенерированном html оставить команду как есть и добавить подпись, что сконверировать нельзя
    };
    convertCommand(text) {
        const userChoice = this.options.userChoice;
        for (const key in NodePlugin.commands) {
            if (text.includes(key)) {
                let out = '';
                const textArray = text.split(' ');
                for (let i = 0; i < NodePlugin.len; i++) {
                    out += NodePlugin.commands[userChoice][i] + ' ';
                }
                out += textArray.slice(NodePlugin.len);
                return out;
            }
        }
        return text;
    }
}
exports.default = NodePlugin;
