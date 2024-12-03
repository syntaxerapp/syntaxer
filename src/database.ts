import { JsonDB, Config } from 'node-json-db'
import { IPlugin, PluginManager } from './plugin-manager'

class Database {
    db = new JsonDB(new Config('syntaxerConfig', true, false, '/'))
    async addPlugin(plugin: IPlugin) {
        await this.db.push('/plugins[]', { obj: plugin })
        // const result = await this.db.getObject<IPlugin>('/plugins')
    }
    async registerPlugins(manager: PluginManager) {
        manager.listPluginList().forEach(async (plugin) => {
            await this.addPlugin(plugin)
        })
    }

    async getPluginList() {
        return await this.db.getData('/plugins[0]')
    }
}

export default Database