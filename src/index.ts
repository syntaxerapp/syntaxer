#! /usr/bin/env node

import { program } from 'commander'
import * as cheerio from 'cheerio'
import htmlCreator from 'html-creator'
import slugify from 'slugify'
import axios from 'axios'
import { IPlugin, PluginManager, SyntaxerPlugin } from './plugin-manager'
import Database from './database'

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
  ]

  const html = new htmlCreator(data)
  const slugified_title = slugify(title).toLowerCase()
  const path = `/home/awer/syntaxer/generated/${slugified_title}.html`
  html.renderHTMLToFile(path)
  console.log(`Your file: file://${path}`)
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
