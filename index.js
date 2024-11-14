#! /usr/bin/env node

import { program } from 'commander'
import * as cheerio from 'cheerio'
import htmlCreator from 'html-creator'
import slugify from 'slugify'

const generateHTML = (title, article) => {
  const data = [
    { type: 'head', content: [{ type: 'title', content: title }] },
    {
      type: 'body',
      attributes: { style: 'padding: 1rem' },
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
  .option('-l, --link <type>', 'give link to convert')
  .action(async (options) => {
    if (options.link) {
      const link = options.link
      const $ = await cheerio.fromURL(link)
      var title = $('title').text()
      const inc = Math.max(title.indexOf('|'), title.indexOf('/'), title.indexOf('\\'))
      if (inc > 0) {
        title = title.slice(0, inc)
      }

      const article = []
      $('h1, h2, h3, p, pre, table, ul, il, a, img').each((index, element) => {
        article.push($(element))
      })
      $('header').each((index, element) => {
        console.log($(element.childNodes[0].name))
      })

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
      let data = []

      console.log('Title:', title)
      article.forEach((element) => {
        const name = element[0].name
        const _class = element[0].class
        const href = element[0].href
        const text = element.text()

        let el = {
          type: name,
          content: text,
        }
        let attributes = {}

        // if ((name == 'p') | name.includes('h') | (name == 'a')) {
        //   el['content'] = text
        // }

        if (name == 'a') {
          if (href) {
            attributes['href'] = href
          }
        }

        if (Object.keys(attributes).length != 0) {
          el['attributes'] = attributes
        }

        data.push(el)
      })
      generateHTML(title, data)
    } else {
      console.log('Type syntaxer -l <link>')
    }
  })

program.command('plugins', 'manage your plugins').executableDir('commands')

program.parse(process.argv)
