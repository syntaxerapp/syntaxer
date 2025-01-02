#! /usr/bin/env node

import { program } from 'commander'
import { db } from '..'

program.argument('<plugin>').action(async (plugin) => {
  if (plugin) {
    const findPlugin = async (plugin: string) => {
      const plugins = await db.getPluginList()
      const pluginsDisabled = await db.getDisabledPluginList()

      for (let i = 0; i < pluginsDisabled.length; i++) {
        const element = pluginsDisabled[i]
        if (element.name == plugin) {
          db.enablePlugin(element, i)
          return 'Plugin enabled!'
        }
      }

      for (let i = 0; i < plugins.length; i++) {
        const element = plugins[i]
        if (element.name == plugin) {
          return 'Plugin already enabled!'
        }
      }

      return 'Plugin not installed'
    }
    console.log(await findPlugin(plugin))
  }
})
program.parse(process.argv)
