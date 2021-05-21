var request = require('request');
var cheerio = require('cheerio');
const fs = require('fs')
const html2md = require('html-to-md')


const baseUrl = 'http://interview.poetries.top'

request('http://interview.poetries.top/docs/base.html', (error, response, body) => {
  if (error || response.statusCode !== 200) return
  const $ = cheerio.load(response.body.toString())
  const sideBarList = []
  $('ul.sidebar-links > li > a.sidebar-link').map((idx, element) => {
    const $href = $(element).attr("href")
    const $text = $(element).text()
    sideBarList.push({
      href: $href,
      text: idx+1+"-"+ $text
    })
  })
  
  sideBarList.map(({href, text}) => {
    getContent(href, text)
  })

  for (let item of sideBarList) {
    getContent(item.href, item.text)
  }
});



const getContent = (url, name) => {
  return new Promise((resolve, reject) => {
    request(baseUrl + url, (error, response, body) => {
      if (error || response.statusCode !== 200) return
      const $ = cheerio.load(response.body.toString())
      $('.main > .theme-default-content div.content__default>:nth-child(n+33)').css('display', 'block')
      $('.readMore-wrapper').remove()
      $('details').map(item => $(item).attr('open', true))
      const content = $('.content__default')
      const htmlStr = content.html()
      const mdStr = html2md(htmlStr).replace(/\[#\]\(#.*\)/g, "")
      fs.writeFile(`./${name}.md`, mdStr, err => {
        if (!err) {
          console.log(`写入${name}--md-----成功`)
        }
      })
    })
  })
}