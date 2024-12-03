"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_json_db_1 = require("node-json-db");
class Database {
    db = new node_json_db_1.JsonDB(new node_json_db_1.Config('syntaxerConfig', true, false, '/'));
    async addPlugin(plugin) {
        await this.db.push('/plugins[]', { obj: plugin });
        // const result = await this.db.getObject<IPlugin>('/plugins')
    }
    async registerPlugins(manager) {
        manager.listPluginList().forEach(async (plugin) => {
            await this.addPlugin(plugin);
        });
    }
    async getPluginList() {
        return await this.db.getData('/plugins[0]');
    }
}
exports.default = Database;
