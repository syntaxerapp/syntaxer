#! /usr/bin/env node

import { program } from 'commander'
import { manager, db } from '..'
import { IPlugin } from '../plugin-manager'

program
  .action(() => {
    console.log('Manage your plugins')
  })
  .command('list')
  .description('List of your plugins')
  .action(async () => {
    const plugins = await db.getPluginList()
    plugins.forEach((plugin: IPlugin) => {
      console.log(plugin)
    })
  })
program.parse(process.argv)
