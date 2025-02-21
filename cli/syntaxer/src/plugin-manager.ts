import requireModule from 'require-module'
import path from 'path'

export interface IPlugin {
  name: string
  package: string
  isRelative?: boolean
  instance?: any
  options?: any
}

export class PluginManager {
  private pluginList: Map<string, IPlugin>
  private srcPath: string

  constructor(srcPath: string) {
    this.pluginList = new Map()
    this.srcPath = srcPath
  }

  private pluginExists(name: string): boolean {
    return this.pluginList.has(name)
  }

  private addPlugin(plugin: IPlugin, packageContents: any): void {
    this.pluginList.set(plugin.name, { ...plugin, instance: packageContents })
  }

  registerPlugin(plugin: IPlugin): void {
    if (!plugin.name || !plugin.package) {
      throw new Error('The plugin name and package are required')
    }

    if (this.pluginExists(plugin.name)) {
      throw new Error(`Cannot add existing plugin ${plugin.name}`)
    }

    try {
      const packageContents = plugin.isRelative
        ? requireModule(path.join(this.srcPath, '..', 'plugins', plugin.package))
        : requireModule(plugin.package)
      this.addPlugin(plugin, packageContents)
    } catch (error) {
      console.log(`Cannot load plugin ${plugin.name}`, error)
    }
  }

  loadPlugin<T>(name: string): T {
    const plugin = this.pluginList.get(name)
    if (!plugin) {
      throw new Error(`Cannot find plugin ${name}`)
    }
    plugin.instance.default.prototype.options = plugin.options
    return Object.create(plugin?.instance.default.prototype) as T
  }

  listPluginList(): Map<string, IPlugin> {
    return this.pluginList
  }
}

export abstract class SyntaxerPlugin {
  options: any
  abstract convertCommand(text: string): string
}
