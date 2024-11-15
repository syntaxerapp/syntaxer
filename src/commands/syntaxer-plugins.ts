#! /usr/bin/env node

import { program } from 'commander'

program.action(() => {
  console.log('Manage your plugins')
})

program.parse(process.argv)
