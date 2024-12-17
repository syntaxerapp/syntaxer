#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const __1 = require("..");
commander_1.program
    .action(() => {
    console.log('Manage your plugins');
})
    .command('list')
    .description('List of your plugins')
    .action(async () => {
    const plugins = await __1.db.getPluginList();
    plugins.forEach((plugin) => {
        console.log(plugin);
    });
});
commander_1.program.parse(process.argv);
