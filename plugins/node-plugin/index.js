"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../src/index");
// import { SyntaxerPlugin } from 'syntaxer'
class NodePlugin extends index_1.SyntaxerPlugin {
    static commands = {
        'npm': ['npm', 'install'],
        'yarn': ['yarn', 'add']
    };
    convertCommand(text) {
        const userChoice = this.options.userChoice;
        for (const key in NodePlugin.commands) {
            if (text.includes(key)) {
                let out = '';
                const textArray = text.split(' ');
                for (let i = 0; i < NodePlugin.commands[userChoice].length; i++) {
                    out += NodePlugin.commands[userChoice][i] + ' ';
                }
                out += textArray.slice(NodePlugin.commands[userChoice].length);
                return out;
            }
        }
        return text;
    }
}
exports.default = NodePlugin;
