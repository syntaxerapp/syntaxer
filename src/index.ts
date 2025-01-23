#! /usr/bin/env node

import fs from 'node:fs'
import axios from 'axios'
import path from 'node:path'
import slugify from 'slugify'
import { JSDOM } from 'jsdom'
import Database from './database'
import * as cheerio from 'cheerio'
import { program } from 'commander'
import htmlCreator from 'html-creator'
import Generator from '@builder/html-generator'
import { Readability } from '@mozilla/readability'
import { IPlugin, PluginManager, SyntaxerPlugin } from './plugin-manager'

const manager = new PluginManager(__dirname)
const db = new Database()

const generateArticle = ($: any, element: any): any[] => {
  let childs: any[] = []

  $(element).contents().each((_index: number, child: any) => {
    if ($(child).contents().length > 1) {
      childs = childs.concat(generateArticle($, child))
    }
    else {
      childs.push($(child))
    }
  })

  return childs
}

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

      const doc = new JSDOM(html, { url: link })
      const reader = new Readability(doc.window.document)
      const article = reader.parse()

      if (!article) {
        throw new Error('Failed to parse article')
      }

      let title = article.title
      const lang = article.lang

      const content = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="file:///${path.join(__dirname, 'style.css')}">
</head>
<body>
${article.content}
</body>
</html>`

      console.log(article)
      console.log(content)

      const inc = Math.max(
        title.indexOf('|'),
        title.indexOf('/'),
        title.indexOf('\\')
      )
      if (inc > 0) {
        title = title.slice(0, inc)
      }

      const os = require('os').homedir()
      const slugified_title = slugify(title).toLowerCase()
      const Path = path.join(os, 'syntaxer', 'generated', `${slugified_title}.html`)
      fs.writeFile(Path, content, (err) => {
        return console.log(err)
      })
      console.log(`Your file: file://${Path}`)

      let data: any[] = []
      const commandsDict: Record<string, string[]> = await db.getCommands()
      const commands: string[] = Object.values(commandsDict).flat(1)
      // content.forEach((element) => {
      //   const name = element[0].name
      //   const _class = element[0].class
      //   const href = element[0].href
      //   let text = element.text()

      //   for (let i = 0; i < commands.length; i++) {
      //     const command = commands[i].toLowerCase()
      //     if (text.includes(command)) {
      //       const pluginName = String(Object.keys(commandsDict).find(key => commandsDict[key as keyof typeof commandsDict].includes(command)))
      //       const plugin = manager.loadPlugin(pluginName) as SyntaxerPlugin
      //       text = text.replace(command, plugin.convertCommand(command))
      //     }
      //   }

      //   let el = {
      //     type: name,
      //     content: text,
      //     attributes: {},
      //   }
      //   let attributes: Record<string, any> = {}

      //   // if ((name == 'p') | name.includes('h') | (name == 'a')) {
      //   //   el['content'] = text
      //   // }

      //   if (name == 'a') {
      //     if (href) {
      //       attributes.href = href
      //     }
      //   }

      //   if (Object.keys(attributes).length != 0) {
      //     el.attributes = attributes
      //   }

      //   data.push(el)
      // })
      // // console.log(data)
      // generateHTML(title, data)
    }
  })

program.command('plugins', 'list of your plugins').executableDir('commands')
program.command('enable', 'enable plugin').executableDir('commands')
program.command('disable', 'disable plugin').executableDir('commands')

program.parse(process.argv)

export { SyntaxerPlugin, manager, db }

