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
const node_fs_1 = __importDefault(require("node:fs"));
const plugin_manager_1 = require("./plugin-manager");
Object.defineProperty(exports, "SyntaxerPlugin", { enumerable: true, get: function () { return plugin_manager_1.SyntaxerPlugin; } });
const database_1 = __importDefault(require("./database"));
const node_path_1 = __importDefault(require("node:path"));
const manager = new plugin_manager_1.PluginManager(__dirname);
exports.manager = manager;
const db = new database_1.default();
exports.db = db;
//TODO: recursive article generation (for tables etc)
// const generateArticle = ($: any, from: any[], article: any[] = []) => {
//   for (let i = 0; i < from.length; i++) {
//     const element = from[i]
//     if (element.name == 'ol' || element.name == 'table') {
//       let childs: any[] = []
//       $(element.childNodes).each((_index: number, element: any) => {
//         childs.push($(element))
//       })
//       return generateArticle($, childs, article)
//     } else {
//       article.push($(element))
//       return article
//     }
//   }
//   return article
// }
const generateHTML = (title, article) => {
    node_fs_1.default.readFile('src/style.css', 'utf8', (err, content) => {
        if (err) {
            console.error(err);
            return;
        }
        const data = [
            {
                type: 'head',
                content: [
                    { type: 'title', content: title },
                    {
                        type: 'style',
                        content: content,
                    },
                ],
            },
            {
                type: 'body',
                // attributes: { style: 'padding: 1rem' },
                content: article,
            },
        ];
        const html = new html_creator_1.default(data);
        const slugified_title = (0, slugify_1.default)(title).toLowerCase();
        const os = require('os').homedir();
        const Path = node_path_1.default.join(os, 'syntaxer', 'generated', `${slugified_title}.html`);
        html.renderHTMLToFile(Path);
        console.log(`Your file: file://${Path}`);
    });
};
commander_1.program
    .version('0.1.0')
    .description('Syntaxer CLI')
    .option('-l, --link <type>', 'link to convert')
    .action(async (options) => {
    const plugins = await db.getPluginList();
    plugins.forEach((plugin) => {
        manager.registerPlugin(plugin);
    });
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
        $('h1, h2, h3, p, pre, table, ul, il, a, img, ol').each((_index, element) => {
            if (element.name == 'ol' || element.name == 'table') {
                $(element.childNodes).each((_index, element) => {
                    article.push($(element));
                });
            }
            else {
                article.push($(element));
            }
        });
        //TODO: 15th string
        // let from: any[] = []
        // $('h1, h2, h3, p, pre, table, ul, il, a, img, ol').each(
        //   (_index: number, element: any) => {
        //     from.push($(element))
        //   }
        // )
        // const article: any[] = generateArticle($, from)
        $('header').each((_index, element) => {
            // console.log($(element.childNodes[0].name))
            // console.log($(element))
        });
        let data = [];
        // console.log('Title:', title)
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
        // console.log(data)
        generateHTML(title, data);
    }
});
commander_1.program.command('plugins', 'list of your plugins').executableDir('commands');
commander_1.program.command('enable', 'enable plugin').executableDir('commands');
commander_1.program.command('disable', 'disable plugin').executableDir('commands');
commander_1.program.parse(process.argv);
