#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.manager = exports.SyntaxerPlugin = void 0;
const node_os_1 = __importDefault(require("node:os"));
const node_fs_1 = __importDefault(require("node:fs"));
const axios_1 = __importDefault(require("axios"));
const node_path_1 = __importDefault(require("node:path"));
const slugify_1 = __importDefault(require("slugify"));
const jsdom_1 = require("jsdom");
const database_1 = __importDefault(require("./database"));
const commander_1 = require("commander");
const readability_1 = require("@mozilla/readability");
const plugin_manager_1 = require("./plugin-manager");
Object.defineProperty(exports, "SyntaxerPlugin", { enumerable: true, get: function () { return plugin_manager_1.SyntaxerPlugin; } });
const configPath = node_path_1.default.join(node_os_1.default.homedir(), 'syntaxer', 'syntaxerConfig.json');
const defaultConfigPath = node_path_1.default.join(__dirname, '..', '..', 'syntaxerConfig.json.default');
if (!node_fs_1.default.existsSync(node_path_1.default.join(node_os_1.default.homedir(), 'syntaxer'))) {
    node_fs_1.default.mkdirSync(node_path_1.default.join(node_os_1.default.homedir(), 'syntaxer'));
}
if (!node_fs_1.default.existsSync(node_path_1.default.join(node_os_1.default.homedir(), 'syntaxer', 'generated'))) {
    node_fs_1.default.mkdirSync(node_path_1.default.join(node_os_1.default.homedir(), 'syntaxer', 'generated'));
}
if (!node_fs_1.default.existsSync(configPath)) {
    node_fs_1.default.copyFile(defaultConfigPath, configPath, (err) => {
        if (err)
            throw err;
        console.log('syntaxerConfig.json does not exist, copied default config');
    });
}
const manager = new plugin_manager_1.PluginManager(__dirname);
exports.manager = manager;
const db = new database_1.default();
exports.db = db;
commander_1.program
    .version('0.1.1')
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
        const doc = new jsdom_1.JSDOM(html, {
            url: link,
            virtualConsole: new jsdom_1.VirtualConsole().on('error', () => {
                /* No-op */
            }),
        });
        const reader = new readability_1.Readability(doc.window.document);
        const article = reader.parse();
        if (!article) {
            throw new Error('Failed to parse article');
        }
        let title = article.title;
        const lang = article.lang;
        let content = article.content.split(/\r?\n|\r|\n/g);
        const commandsDict = await db.getCommands();
        const commands = Object.values(commandsDict).flat(1);
        for (let i in content) {
            let line = content[i];
            for (let j in commands) {
                const command = commands[j];
                if (line.includes(command)) {
                    const pluginName = String(Object.keys(commandsDict).find((key) => commandsDict[key].includes(command)));
                    const plugin = manager.loadPlugin(pluginName);
                    content[i] = plugin.convertCommand(line);
                }
            }
        }
        const htmlContent = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="file:///${node_path_1.default.join(__dirname, 'style.css')}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/atom-one-dark.min.css" />
</head>
<body>
${content.join('')}
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/highlight.min.js"
  integrity="sha256-1zu+3BnLYV9LdiY85uXMzii3bdrkelyp37e0ZyTAQh0="
  crossorigin="anonymous"
></script>
<script>
  document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block)
    })
  })
</script>
</body>
</html>`;
        const inc = Math.max(title.indexOf('|'), title.indexOf('/'), title.indexOf('\\'));
        if (inc > 0) {
            title = title.slice(0, inc);
        }
        const homedir = node_os_1.default.homedir();
        const slugified_title = (0, slugify_1.default)(title).toLowerCase();
        const Path = node_path_1.default.join(homedir, 'syntaxer', 'generated', `${slugified_title}.html`);
        node_fs_1.default.writeFile(Path, htmlContent, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log(`Your file: file://${Path}`);
        });
    }
});
commander_1.program.command('plugins', 'list of your plugins').executableDir('commands');
commander_1.program.command('enable', 'enable plugin').executableDir('commands');
commander_1.program.command('disable', 'disable plugin').executableDir('commands');
commander_1.program.command('choose', `set plugin's preferred command`).executableDir('commands');
commander_1.program.parse(process.argv);
