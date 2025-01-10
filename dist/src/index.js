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
    const data = [
        {
            type: 'head',
            content: [
                { type: 'title', content: title },
                {
                    type: 'style',
                    content: `
          

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
 }

html {
    overflow-y: scroll;
    height: 100%;
    font: 100%/1.5 sans-serif;
    word-wrap: break-word;
    margin: 0 auto;
    padding: 1.5em;
 }

@media (min-width: 768px) {
    html {
        font-size: 125%;
        max-width: 42em;
 } }

h1, h2, h3, h4 {
    margin: 2.5rem 0 1.5rem 0;
    line-height: 1.25;
    color: #333;
 }

a {
    color: #fa6432;
    text-decoration: none;
 }
a:hover, a:focus, a:active {
    text-decoration: underline;
 }

p {
    margin: 1em 0;
    line-height: 1.5;
 }
p code {
    background-color: #eee;
    padding: 0.05em 0.2em;
    border: 1px solid #ccc;
 }

ol, ul {
    margin: 1em;
 }
ol li ol, ol li ul, ul li ol, ul li ul {
    margin: 0 2em;
 }
ol li p, ul li p {
    margin: 0;
 }

dl {
    font-family: monospace, monospace;
 }
dl dt {
    font-weight: bold;
 }
dl dd {
    margin: -1em 0 1em 1em;
 }

img {
    max-width: 100%;
    display: block;
    margin: 0 auto;
    padding: 0.5em;
 }

blockquote {
    padding-left: 1em;
    font-style: italic;
    border-left: solid 1px #fa6432;
 }

table {
    font-size: 1rem;
    text-align: left;
    caption-side: bottom;
    margin-bottom: 2em;
 }
table * {
    border: none;
 }
table thead, table tr {
    display: table;
    table-layout: fixed;
    width: 100%;
 }
table tr:nth-child(even) {
    background-color: rgba(200, 200, 200, 0.2);
 }
table tbody {
    display: block;
    max-height: 70vh;
    overflow-y: auto;
 }
table td, table th {
    padding: 0.25em;
 }

table, .highlight > pre, pre.example {
    max-height: 70vh;
    margin: 1em 0;
    padding: 1em;
    overflow: auto;
    font-size: 0.85rem;
    font-family: monospace, monospace;
    border: 1px dashed rgba(250, 100, 50, 0.5);
}

.title {
    font-size: 2.5em;
}

.subtitle {
    font-weight: normal;
    font-size: 0.75em;
    color: #666;
}

.tags {
    margin-top: -1.5rem;
    padding-bottom: 1.5em;
}
.tags li {
    display: inline;
    margin-right: 0.5em;
}

figure {
    margin: 1em 0;
}
figure figcaption {
    font-family: monospace, monospace;
    font-size: 0.75em;
    text-align: center;
    color: grey;
}

.footnote-definition sup {
    margin-left: -1.5em;
    float: left;
}

.footnote-definition .footnote-body {
    margin: 1em 0;
    padding: 0 1em;
    border: 1px dashed rgba(250, 100, 50, 0.3);
    background-color: rgba(200, 200, 200, 0.2);
}
.footnote-definition .footnote-body p:only-child {
    margin: 0.2em 0;
}

header {
    display: flex;
    justify-content: space-between;
}
header nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
header a + a {
    margin-left: 1rem;
}

.posts {
    margin: 0;
    list-style: none;
}
.posts .post a {
    display: flex;
    padding: 0.5em 0;
    color: black;
}
.posts .post a:hover, .posts .post a:focus, .posts .post a:active {
    text-decoration: none;
    background: rgba(200, 200, 200, 0.2);
}
.posts .post date {
    font-family: monospace, monospace;
    font-size: 0.8rem;
    vertical-align: middle;
    padding-right: 2rem;
    color: grey;
}


        `,
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
    const path = `/home/awer/syntaxer/generated/${slugified_title}.html`;
    html.renderHTMLToFile(path);
    console.log(`Your file: file://${path}`);
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
