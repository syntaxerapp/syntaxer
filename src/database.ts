import { JsonDB, Config } from 'node-json-db'
import { IPlugin, PluginManager } from './plugin-manager'

class Database {
    db = new JsonDB(new Config('syntaxerConfig', true, true, '/'))
    async addPlugin(plugin: IPlugin) {
        const plugins = await this.getPluginList()
        let toAdd = true
        plugins.forEach(async (element: IPlugin) => {
            if (element.name === plugin.name) {
                toAdd = false
            }
        })
        if (toAdd) {
            await this.db.push('/plugins[]', plugin, true)
        }
        // const result = await this.db.getObject<IPlugin>('/plugins')
    }
    async addPluginsFromManager(manager: PluginManager) {
        manager.listPluginList().forEach(async (plugin) => {
            await this.addPlugin(plugin)
        })
    }

    async getPluginList() {
        return await this.db.getData('/plugins')
    }
}

export default Database