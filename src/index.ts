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

      const article: any[] = []
      $('h1, h2, h3, p, pre, table, ul, il, a, img, ol').each(
        (_index: number, element: any) => {
          if (element.name == 'ol' || element.name == 'table') {
            $(element.childNodes).each(
              (_index: number, element: any) => {
                article.push($(element))
              }
            )
          } else {
            article.push($(element))
          }
        }
      )
      //TODO: 15th string
      // let from: any[] = []
      // $('h1, h2, h3, p, pre, table, ul, il, a, img, ol').each(
      //   (_index: number, element: any) => {
      //     from.push($(element))
      //   }
      // )
      // const article: any[] = generateArticle($, from)
      $('header').each((_index: number, element: any) => {
        // console.log($(element.childNodes[0].name))
        // console.log($(element))
      })
      let data: any[] = []

      // console.log('Title:', title)
      article.forEach((element) => {
        const name = element[0].name
        const _class = element[0].class
        const href = element[0].href
        const text = element.text()

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

