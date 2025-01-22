import { JsonDB, Config } from 'node-json-db'
import { IPlugin, PluginManager, SyntaxerPlugin } from './plugin-manager'

class Database {
    db = new JsonDB(new Config('syntaxerConfig', true, true, '/'))

    async getPluginList() {
        return await this.db.getData('/plugins/enabled')
    }

    async getDisabledPluginList() {
        return await this.db.getData('/plugins/disabled')
    }

    async getCommands() {
        return await this.db.getData('/commands')
    }

    async addPlugin(plugin: IPlugin) {
        const plugins = await this.getPluginList()
        let toAdd = true
        plugins.forEach(async (element: IPlugin) => {
            if (element.name === plugin.name) {
                toAdd = false
            }
        })
        if (toAdd) {
            await this.db.push('/plugins/enabled[]', plugin, true)
        }
    }

    async enablePlugin(plugin: IPlugin, index: number) {
        await this.db.delete(`/plugins/disabled[${index}]`)
        await this.db.push('/plugins/enabled[]', plugin, true)
    }

    async disablePlugin(plugin: IPlugin, index: number) {
        await this.db.delete(`/plugins/enabled[${index}]`)
        await this.db.push('/plugins/disabled[]', plugin, true)
    }

    // async registerPluginCommands(plugin: SyntaxerPlugin) {
    //     await console.log(plugin)
    // }
}

export default Database