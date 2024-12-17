"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_json_db_1 = require("node-json-db");
class Database {
    db = new node_json_db_1.JsonDB(new node_json_db_1.Config('syntaxerConfig', true, true, '/'));
    async addPlugin(plugin) {
        const plugins = await this.getPluginList();
        let toAdd = true;
        plugins.forEach(async (element) => {
            if (element.name === plugin.name) {
                toAdd = false;
            }
        });
        if (toAdd) {
            await this.db.push('/plugins[]', plugin, true);
        }
        // const result = await this.db.getObject<IPlugin>('/plugins')
    }
    async addPluginsFromManager(manager) {
        manager.listPluginList().forEach(async (plugin) => {
            await this.addPlugin(plugin);
        });
    }
    async getPluginList() {
        return await this.db.getData('/plugins');
    }
}
exports.default = Database;
