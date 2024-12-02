"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyntaxerPlugin = void 0;
const require_module_1 = __importDefault(require("require-module"));
const path_1 = __importDefault(require("path"));
class PluginManager {
    pluginList;
    pluginFolder;
    constructor(pluginFolder) {
        this.pluginList = new Map();
        this.pluginFolder = pluginFolder;
    }
    pluginExists(name) {
        return this.pluginList.has(name);
    }
    addPlugin(plugin, packageContents) {
        this.pluginList.set(plugin.name, { ...plugin, instance: packageContents });
    }
    registerPlugin(plugin) {
        if (!plugin.name || !plugin.package) {
            throw new Error('The plugin name and package are required');
        }
        if (this.pluginExists(plugin.name)) {
            throw new Error(`Cannot add existing plugin ${plugin.name}`);
        }
        try {
            const packageContents = plugin.isRelative
                ? (0, require_module_1.default)(path_1.default.join(this.pluginFolder, plugin.package))
                : (0, require_module_1.default)(plugin.package);
            this.addPlugin(plugin, packageContents);
        }
        catch (error) {
            console.log(`Cannot load plugin ${plugin.name}`, error);
        }
    }
    loadPlugin(name) {
        const plugin = this.pluginList.get(name);
        if (!plugin) {
            throw new Error(`Cannot find plugin ${name}`);
        }
        plugin.instance.default.prototype.options = plugin.options;
        return Object.create(plugin?.instance.default.prototype);
    }
    listPluginList() {
        return this.pluginList;
    }
}
exports.default = PluginManager;
class SyntaxerPlugin {
    options;
}
exports.SyntaxerPlugin = SyntaxerPlugin;
