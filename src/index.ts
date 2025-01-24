#! /usr/bin/env node

import os from 'node:os'
import fs from 'node:fs'
import axios from 'axios'
import path from 'node:path'
import slugify from 'slugify'
import { JSDOM, VirtualConsole } from 'jsdom'
import Database from './database'
import { program } from 'commander'
import { Readability } from '@mozilla/readability'
import { IPlugin, PluginManager, SyntaxerPlugin } from './plugin-manager'

const configPath = path.join(os.homedir(), 'syntaxer', 'syntaxerConfig.json')
const defaultConfigPath = path.join(
  __dirname,
  '..',
  '..',
  'syntaxerConfig.json.default'
)

if (!fs.existsSync(configPath)) {
  fs.copyFile(defaultConfigPath, configPath, (err) => {
    if (err) throw err
    console.log('syntaxerConfig.json does not exist, copied default config')
  })
}

const manager = new PluginManager(__dirname)
const db = new Database()

program
  .version('0.1.0')
  .description('Syntaxer CLI')
  .option('-l, --link <type>', 'link to convert')
  .action(async (options) => {
    const plugins = await db.getPluginList()
    plugins.forEach((plugin: IPlugin) => {
      manager.registerPlugin(plugin)
    })
    if (options.link) {
      const link = options.link

      const response = await axios.get(link)
      const html = response.data

      const doc = new JSDOM(html, {
        url: link,
        virtualConsole: new VirtualConsole().on('error', () => {
          /* No-op */
        }),
      })
      const reader = new Readability(doc.window.document)
      const article = reader.parse()

      if (!article) {
        throw new Error('Failed to parse article')
      }

      let title = article.title
      const lang = article.lang

      let content = article.content.split(/\r?\n|\r|\n/g)
      const commandsDict: Record<string, string[]> = await db.getCommands()
      const commands: string[] = Object.values(commandsDict).flat(1)

      for (let i in content) {
        let line = content[i]
        for (let j in commands) {
          const command = commands[j]
          if (line.includes(command)) {
            const pluginName = String(
              Object.keys(commandsDict).find((key) =>
                commandsDict[key as keyof typeof commandsDict].includes(command)
              )
            )
            const plugin = manager.loadPlugin(pluginName) as SyntaxerPlugin
            content[i] = plugin.convertCommand(line)
          }
        }
      }

      const htmlContent = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="file:///${path.join(__dirname, 'style.css')}">
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
</html>`

      const inc = Math.max(
        title.indexOf('|'),
        title.indexOf('/'),
        title.indexOf('\\')
      )
      if (inc > 0) {
        title = title.slice(0, inc)
      }

      const homedir = os.homedir()
      const slugified_title = slugify(title).toLowerCase()
      const Path = path.join(
        homedir,
        'syntaxer',
        'generated',
        `${slugified_title}.html`
      )
      fs.writeFile(Path, htmlContent, (err) => {
        if (err) {
          return console.log(err)
        }
        console.log(`Your file: file://${Path}`)
      })
    }
  })

program.command('plugins', 'list of your plugins').executableDir('commands')
program.command('enable', 'enable plugin').executableDir('commands')
program.command('disable', 'disable plugin').executableDir('commands')

program.parse(process.argv)

export { SyntaxerPlugin, manager, db }
