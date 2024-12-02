"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_manager_1 = require("../../plugin-manager");
class SamplePlugin extends plugin_manager_1.SyntaxerPlugin {
    convertCommand(text) {
        return text + ' converted';
    }
}
exports.default = SamplePlugin;
