#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const __1 = require("..");
commander_1.program
    .action(async () => {
    const plugins = await __1.db.getPluginList();
    if (plugins) {
        console.log('Enabled plugins:');
        plugins.forEach((plugin) => {
            console.log('- Name: ' + plugin.name);
            if (plugin.options?.userChoice) {
                console.log('  User choice: ' + plugin.options.userChoice);
            }
        });
    }
    const pluginsDisabled = await __1.db.getDisabledPluginList();
    if (pluginsDisabled) {
        console.log('\nDisabled plugins:');
        pluginsDisabled.forEach((plugin) => {
            console.log('- Name: ' + plugin.name);
            if (plugin.options?.userChoice) {
                console.log('  User choice: ' + plugin.options.userChoice);
            }
        });
    }
});
commander_1.program.parse(process.argv);
