"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../src/index");
// import { SyntaxerPlugin } from 'syntaxer'
class NodePlugin extends index_1.SyntaxerPlugin {
    static len = 2;
    static commands = {
        'npm': [
            'npm',
            'install -g',
            'install',
            'start',
            'uninstall',
            '--save-dev',
            'update',
            'view',
        ],
        'yarn': [
            'yarn',
            'global add',
            'add',
            'run',
            'remove',
            '--dev',
            'upgrade',
            'info',
        ],
        'pnpm': [
            'pnpm',
            'install --global',
            'install',
            'start',
            'uninstall',
            '--save-dev',
            'update',
            'info',
        ],
    };
    convertCommand(text) {
        const userChoice = this.options.userChoice;
        for (let key in NodePlugin.commands) {
            if (text.includes(key)) {
                let out = text;
                for (let i in NodePlugin.commands[key]) {
                    const searchValue = NodePlugin.commands[key][i];
                    const replaceValue = NodePlugin.commands[userChoice][i];
                    out = out.replace(searchValue + ' ', replaceValue + ' ');
                }
                return out;
            }
        }
        return text;
    }
}
exports.default = NodePlugin;
