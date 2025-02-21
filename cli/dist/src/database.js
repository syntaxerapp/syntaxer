"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_json_db_1 = require("node-json-db");
const node_path_1 = __importDefault(require("node:path"));
const node_os_1 = __importDefault(require("node:os"));
class Database {
    db = new node_json_db_1.JsonDB(new node_json_db_1.Config(node_path_1.default.join(node_os_1.default.homedir(), 'syntaxer', 'syntaxerConfig.json'), true, true, '/'));
    async getPluginList() {
        return await this.db.getData('/plugins/enabled');
    }
    async getDisabledPluginList() {
        return await this.db.getData('/plugins/disabled');
    }
    async getCommands() {
        return await this.db.getData('/commands');
    }
    async addPlugin(plugin) {
        const plugins = await this.getPluginList();
        let toAdd = true;
        plugins.forEach(async (element) => {
            if (element.name === plugin.name) {
                toAdd = false;
            }
        });
        if (toAdd) {
            await this.db.push('/plugins/enabled[]', plugin, true);
        }
    }
    async enablePlugin(plugin, index) {
        await this.db.delete(`/plugins/disabled[${index}]`);
        await this.db.push('/plugins/enabled[]', plugin, true);
    }
    async disablePlugin(plugin, index) {
        await this.db.delete(`/plugins/enabled[${index}]`);
        await this.db.push('/plugins/disabled[]', plugin, true);
    }
    async setChoice(index, choice) {
        await this.db.push(`/plugins/enabled[${index}]/options/userChoice`, choice, true);
    }
    async setChoiceDisabled(index, choice) {
        await this.db.push(`/plugins/disabled[${index}]/options/userChoice`, choice, true);
    }
}
exports.default = Database;
