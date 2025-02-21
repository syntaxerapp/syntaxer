#! /usr/bin/env node

import { program } from 'commander'
import { db } from '..'
import inquirer from 'inquirer'

const getChoice = async (plugin: string) => {
  const commands = await db.getCommands()
  const plugin_commands = commands[plugin]
  if (plugin_commands == undefined) {
    return
  }
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'plugin',
      message: 'Choose a command',
      choices: plugin_commands,
    }
  ])
  return answers.plugin
}

program.argument('<plugin>').action(async (plugin) => {
  if (plugin) {
    const findPlugin = async (plugin: string) => {
      const plugins = await db.getPluginList()
      
      for (let i = 0; i < plugins.length; i++) {
        const element = plugins[i]
        if (element.name == plugin) {
          const choice = await getChoice(plugin)
          if (choice == undefined) {
            return 'No commands available'
          }
          db.setChoice(i, choice)
          return `Set ${choice} for plugin ${plugin}`
        }
      }

      const pluginsDisabled = await db.getDisabledPluginList()
      
      for (let i = 0; i < pluginsDisabled.length; i++) {
        const element = pluginsDisabled[i]
        if (element.name == plugin) {
          const choice = await getChoice(plugin)
          if (choice == undefined) {
            return 'No commands available'
          }
          db.setChoiceDisabled(i, choice)
          return `Set ${choice} for plugin ${plugin}`
        }
      }

      return 'Plugin not installed'
    }
    console.log(await findPlugin(plugin))
  }
})
program.parse(process.argv)
