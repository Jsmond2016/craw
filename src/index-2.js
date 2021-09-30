var request = require('axios');
var cheerio = require('cheerio');
const fs = require('fs')
const path = require('path')

// const baseUrl = 'http://h2.ioliu.cn/bing/TheBroads_ZH-CN0485661191_1920x1080.jpg?imageslim'
const baseUrl = 'http://h2.ioliu.cn/bing'
// downloadFiles('https://h2.ioliu.cn/bing/Firefox_ZH-CN0575885603_1920x1080.jpg')


request.get('https://bing.ioliu.cn/?p=4').then(async (response) => {
  console.log('response.statusCode: ', response.status);
  if (response.status !== 200) return
  const $ = cheerio.load(response.data)
  const hrefList = $('.container > div.item > div.progressive > a.mark').map((_, item) => {
    const url = baseUrl + $(item).attr('href').split('?')[0].replace('/photo', '') + '_1920x1080.jpg'
    return url
  })

  for (let item of hrefList) {
    console.log('item: ', item);
    await downloadFiles(item);
  }
});

// 简易小爬虫爬取图片并下载 https://blog.csdn.net/weixin_45786214/article/details/106251139
// https://www.cnblogs.com/gaoht/p/11303611.html
async function downloadFiles(url) {
  const fileurl = url.split('?')[0]
  const idx = fileurl.lastIndexOf('/');
  const fileName = fileurl.slice(idx + 1)
  const dest = path.join(__dirname, 'imgs', fileName)

  const file = fs.createWriteStream(dest, { autoClose: true });
  // http://www.axios-js.com/docs/  搜索 pipe 关键字
  request.get(url, {  responseType:'stream' }).then(response => {
    response.data.pipe(file).on('finish', () => {
      console.log('下载完成 ==> ' + fileName)
    }).on('error', (err) => {
      console.log('err', err);
    })
  })

}