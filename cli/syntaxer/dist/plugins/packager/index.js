"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../src/index");
// import { SyntaxerPlugin } from 'syntaxer'
class Packager extends index_1.SyntaxerPlugin {
    static len = 4;
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
    };
    convertCommand(text) {
        const userChoice = this.options.userChoice;
        for (let key in Packager.commands) {
            if (text.includes(key)) {
                let out = text;
                for (let i in Packager.commands[key]) {
                    const searchValue = Packager.commands[key][i];
                    const replaceValue = Packager.commands[userChoice][i];
                    out = out.replace(searchValue + ' ', replaceValue + ' ');
                }
                return out;
            }
        }
        return text;
    }
}
exports.default = Packager;
