#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
commander_1.program.action(() => {
    console.log('Manage your plugins');
});
commander_1.program.parse(process.argv);
