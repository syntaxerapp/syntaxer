#! /usr/bin/env node

import { program } from 'commander'
import { db } from '..'

program.argument('<plugin>').action(async (plugin) => {
  if (plugin) {
    const findPlugin = async (plugin: string) => {
      const plugins = await db.getPluginList()
      
      for (let i = 0; i < plugins.length; i++) {
        const element = plugins[i]
        if (element.name == plugin) {
          db.disablePlugin(element, i)
          return 'Plugin disabled!'
        }
      }
      
      const pluginsDisabled = await db.getDisabledPluginList()

      for (let i = 0; i < pluginsDisabled.length; i++) {
        const element = pluginsDisabled[i]
        if (element.name == plugin) {
          return 'Plugin is not enabled!'
        }
      }

      return 'Plugin not installed'
    }
    console.log(await findPlugin(plugin))
  }
})
program.parse(process.argv)
