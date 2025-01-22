"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_json_db_1 = require("node-json-db");
class Database {
    db = new node_json_db_1.JsonDB(new node_json_db_1.Config('syntaxerConfig', true, true, '/'));
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
}
exports.default = Database;
