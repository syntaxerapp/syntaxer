#! /usr/bin/env node

import { program } from 'commander'
import * as cheerio from 'cheerio'
import htmlCreator from 'html-creator'
import slugify from 'slugify'
import axios from 'axios'
import fs from 'node:fs'
import { IPlugin, PluginManager, SyntaxerPlugin } from './plugin-manager'
import Database from './database'
import path from 'node:path'
const manager = new PluginManager(__dirname)
const db = new Database()

interface IDictionary {
  [key: string]: string
}

function findKeyByValue(dict: IDictionary, value: string): string | undefined {
  return Object.keys(dict).find(key => dict[key] === value)
}

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

// const generateArticle = ($: any, element: any): any[] => {
//   let article: any[] = []
//   element.each(
//     (_index: number, element: any) => {
//       if (element.name == 'ol' || element.name == 'table') {
//         article = article.concat(generateArticle($, $(element.childNodes)))
//       } else {
//         article.push($(element))
//       }
//     }
//   )
//   return article
// }

const generateHTML = (title: string, article: any[]) => {
  fs.readFile('src/style.css', 'utf8', (err: any, content: string) => {
    if (err) {
      console.error(err)
      return
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
    ]

    const html = new htmlCreator(data)
    const slugified_title = slugify(title).toLowerCase()
    const os = require('os').homedir()
    const Path = path.join(os, 'syntaxer', 'generated', `${slugified_title}.html`)
    html.renderHTMLToFile(Path)
    console.log(`Your file: file://${Path}`)
  })
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

      const $ = cheerio.load(html)
      var title = $('title').text()
      const inc = Math.max(
        title.indexOf('|'),
        title.indexOf('/'),
        title.indexOf('\\')
      )
      if (inc > 0) {
        title = title.slice(0, inc)
      }

      const article: any[] = generateArticle($, $('h1, h2, h3, p, pre, table, ul, il, a, img, ol, tr, td'))
      // let article: any[] = []
      // $('h1, h2, h3, p, pre, table, ul, il, a, img, ol').each(
      //   (_index: number, element: any) => {
      //     if (element.name == 'ol' || element.name == 'table') {
      //       $(element.childNodes).each(
      //         (_index: number, element: any) => {
      //           article.push($(element))
      //         }
      //       )
      //     } else {
      //       article.push($(element))
      //     }
      //   }
      // )
      // console.log(article)
      // console.log(1)
      // console.log(generateArticle($, $('h1, h2, h3, p, pre, table, ul, il, a, img, ol')))
      //TODO: 15th string
      // let from: any[] = []
      // $('h1, h2, h3, p, pre, table, ul, il, a, img, ol').each(
      //   (_index: number, element: any) => {
      //     from.push($(element))
      //   }
      // )
      // const article: any[] = generateArticle($, from)
      // $('header').each((_index: number, element: any) => {
      //   // console.log($(element.childNodes[0].name))
      //   // console.log($(element))
      // })
      let data: any[] = []
      const commandsDict: Record<string, string[]> = await db.getCommands()
      const commands: string[] = Object.values(commandsDict).flat(1)
      // console.log(commandsDict, commands)

      // console.log('Title:', title)
      article.forEach((element) => {
        const name = element[0].name
        const _class = element[0].class
        const href = element[0].href
        let text = element.text()

        for (let i = 0; i < commands.length; i++) {
          const command = commands[i].toLowerCase()
          if (text.includes(command)) {
            const pluginName = String(Object.keys(commandsDict).find(key => commandsDict[key as keyof typeof commandsDict].includes(command)))
            const plugin = manager.loadPlugin(pluginName) as SyntaxerPlugin
            text = text.replace(command, plugin.convertCommand(command))
          }
        }

        let el = {
          type: name,
          content: text,
          attributes: {},
        }
        let attributes: Record<string, any> = {}

        // if ((name == 'p') | name.includes('h') | (name == 'a')) {
        //   el['content'] = text
        // }

        if (name == 'a') {
          if (href) {
            attributes.href = href
          }
        }

        if (Object.keys(attributes).length != 0) {
          el.attributes = attributes
        }

        data.push(el)
      })
      // console.log(data)
      generateHTML(title, data)
    }
  })

program.command('plugins', 'list of your plugins').executableDir('commands')
program.command('enable', 'enable plugin').executableDir('commands')
program.command('disable', 'disable plugin').executableDir('commands')

program.parse(process.argv)

export { SyntaxerPlugin, manager, db }

