#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const __1 = require("..");
const inquirer_1 = __importDefault(require("inquirer"));
const getChoice = async (plugin) => {
    const commands = await __1.db.getCommands();
    const plugin_commands = commands[plugin];
    if (plugin_commands == undefined) {
        return;
    }
    const answers = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'plugin',
            message: 'Choose a command',
            choices: plugin_commands,
        }
    ]);
    return answers.plugin;
};
commander_1.program.argument('<plugin>').action(async (plugin) => {
    if (plugin) {
        const findPlugin = async (plugin) => {
            const plugins = await __1.db.getPluginList();
            for (let i = 0; i < plugins.length; i++) {
                const element = plugins[i];
                if (element.name == plugin) {
                    const choice = await getChoice(plugin);
                    if (choice == undefined) {
                        return 'No commands available';
                    }
                    __1.db.setChoice(i, choice);
                    return `Set ${choice} for plugin ${plugin}`;
                }
            }
            const pluginsDisabled = await __1.db.getDisabledPluginList();
            for (let i = 0; i < pluginsDisabled.length; i++) {
                const element = pluginsDisabled[i];
                if (element.name == plugin) {
                    const choice = await getChoice(plugin);
                    if (choice == undefined) {
                        return 'No commands available';
                    }
                    __1.db.setChoiceDisabled(i, choice);
                    return `Set ${choice} for plugin ${plugin}`;
                }
            }
            return 'Plugin not installed';
        };
        console.log(await findPlugin(plugin));
    }
});
commander_1.program.parse(process.argv);
