#! /usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.manager = exports.SyntaxerPlugin = void 0;
const commander_1 = require("commander");
const cheerio = __importStar(require("cheerio"));
const html_creator_1 = __importDefault(require("html-creator"));
const slugify_1 = __importDefault(require("slugify"));
const axios_1 = __importDefault(require("axios"));
const plugin_manager_1 = require("./plugin-manager");
Object.defineProperty(exports, "SyntaxerPlugin", { enumerable: true, get: function () { return plugin_manager_1.SyntaxerPlugin; } });
const database_1 = __importDefault(require("./database"));
const manager = new plugin_manager_1.PluginManager(__dirname);
exports.manager = manager;
const db = new database_1.default();
exports.db = db;
// manager.registerPlugin({
//   name: 'sample-plugin',
//   package: 'sample-plugin',
//   isRelative: true,
// })
manager.registerPlugin({
    name: 'node-plugin',
    package: 'node-plugin',
    isRelative: true,
    options: { userChoice: 'yarn' }
});
const generateHTML = (title, article) => {
    const data = [
        { type: 'head', content: [{ type: 'title', content: title }] },
        {
            type: 'body',
            attributes: { style: 'padding: 1rem' },
            content: article,
        },
    ];
    const html = new html_creator_1.default(data);
    const slugified_title = (0, slugify_1.default)(title).toLowerCase();
    const path = `/home/awer/syntaxer/generated/${slugified_title}.html`;
    html.renderHTMLToFile(path);
    console.log(`Your file: file://${path}`);
};
commander_1.program
    .version('0.1.0')
    .description('Syntaxer CLI')
    .option('-l, --link <type>', 'give link to convert')
    .action(async (options) => {
    if (options.link) {
        const link = options.link;
        const response = await axios_1.default.get(link);
        const html = response.data;
        const $ = cheerio.load(html);
        var title = $('title').text();
        const inc = Math.max(title.indexOf('|'), title.indexOf('/'), title.indexOf('\\'));
        if (inc > 0) {
            title = title.slice(0, inc);
        }
        const article = [];
        $('h1, h2, h3, p, pre, table, ul, il, a, img').each((_index, element) => {
            article.push($(element));
        });
        $('header').each((_index, element) => {
            // console.log($(element.childNodes[0].name))
            console.log($(element));
        });
        // let data = [
        //   {
        //     type: 'div',
        //     content: [
        //       {
        //         type: 'span',
        //         content: 'A Button Span Deluxe',
        //         attributes: { className: 'button' },
        //       },
        //       {
        //         type: 'a',
        //         content: 'Click here',
        //         attributes: { href: '/path-to-infinity', target: '_blank' },
        //       },
        //     ],
        //   },
        //   {
        //     type: 'table',
        //     content: [{ type: 'td', content: 'I am in a table!' }],
        //   },
        // ]
        let data = [];
        console.log('Title:', title);
        article.forEach((element) => {
            const name = element[0].name;
            const _class = element[0].class;
            const href = element[0].href;
            const text = element.text();
            let el = {
                type: name,
                content: text,
                attributes: {},
            };
            let attributes = {};
            // if ((name == 'p') | name.includes('h') | (name == 'a')) {
            //   el['content'] = text
            // }
            if (name == 'a') {
                if (href) {
                    attributes.href = href;
                }
            }
            if (Object.keys(attributes).length != 0) {
                el.attributes = attributes;
            }
            data.push(el);
        });
        generateHTML(title, data);
    }
    else {
        await db.addPluginsFromManager(manager);
        console.log(await db.getPluginList());
        // const plugin = manager.loadPlugin<SyntaxerPlugin>('sample-plugin')
        const plugin = manager.loadPlugin('node-plugin');
        console.log(plugin.convertCommand('npm install commander'));
        console.log('Type syntaxer -l <link>');
    }
});
commander_1.program.command('plugins', 'manage your plugins').executableDir('commands');
commander_1.program.parse(process.argv);
