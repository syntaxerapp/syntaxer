#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const __1 = require("..");
commander_1.program.argument('<plugin>').action(async (plugin) => {
    if (plugin) {
        const findPlugin = async (plugin) => {
            const plugins = await __1.db.getPluginList();
            const pluginsDisabled = await __1.db.getDisabledPluginList();
            for (let i = 0; i < pluginsDisabled.length; i++) {
                const element = pluginsDisabled[i];
                if (element.name == plugin) {
                    __1.db.enablePlugin(element, i);
                    return 'Plugin enabled!';
                }
            }
            for (let i = 0; i < plugins.length; i++) {
                const element = plugins[i];
                if (element.name == plugin) {
                    return 'Plugin already enabled!';
                }
            }
            return 'Plugin not installed';
        };
        console.log(await findPlugin(plugin));
    }
});
commander_1.program.parse(process.argv);
