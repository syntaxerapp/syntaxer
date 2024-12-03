"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../src/index");
// import { SyntaxerPlugin } from 'syntaxer'
class SamplePlugin extends index_1.SyntaxerPlugin {
    convertCommand(text) {
        return text + ' converted';
    }
}
exports.default = SamplePlugin;