#! /usr/bin/env node

import { program } from 'commander'
import { manager, db } from '..'
import { IPlugin } from '../plugin-manager'

program
  .action(async () => {
    const plugins = await db.getPluginList()
    if (plugins) {
      console.log('Enabled plugins:')
      plugins.forEach((plugin: IPlugin) => {
        console.log('- Name: ' + plugin.name)
        if (plugin.options?.userChoice) {
          console.log('  User choice: ' + plugin.options.userChoice)
        }
      })
    }

    const pluginsDisabled = await db.getDisabledPluginList()
    if (pluginsDisabled) {
      console.log('\nDisabled plugins:')
      pluginsDisabled.forEach((plugin: IPlugin) => {
        console.log('- Name: ' + plugin.name)
        if (plugin.options?.userChoice) {
          console.log('  User choice: ' + plugin.options.userChoice)
        }
      })
    }
  })
program.parse(process.argv)
