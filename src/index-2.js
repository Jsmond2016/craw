var request = require('request');
var cheerio = require('cheerio');
const fs = require('fs')
const path = require('path')

// const baseUrl = 'http://h2.ioliu.cn/bing/TheBroads_ZH-CN0485661191_1920x1080.jpg?imageslim'
const baseUrl = 'http://h2.ioliu.cn/bing'
// downloadFiles('https://h2.ioliu.cn/bing/Firefox_ZH-CN0575885603_1920x1080.jpg')

request.defaults({
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Cookie': '_ga=GA1.2.1033538334.1624330540; _gid=GA1.2.245423334.1632725679; Hm_lvt_667639aad0d4654c92786a241a486361=1631155121,1631952275,1632725679,1632797509; likes=; Hm_lpvt_667639aad0d4654c92786a241a486361=1632883251',
    'Host': 'bing.ioliu.cn',
    'Pragma': 'no-cache',
    'sec-ch-ua': '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': "Windows",
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode':' navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User':' ?1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
  },
}).get('https://bing.ioliu.cn/?p=1', async (error, response, body) => {
  console.log('response.statusCode: ', response.statusCode);
  if (error || response.statusCode !== 200) return
  const $ = cheerio.load(body)
  const hrefList = $('.container > div.item > div.progressive > a.mark').map((_, item) => {
    const url = baseUrl + $(item).attr('href').split('?')[0].replace('/photo', '') + '_1920x1080.jpg'
    return url
  })

  console.log('hrefList: ', hrefList);
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
  const dest = path.join(__dirname, 'imgs',  fileName)

  const file = fs.createWriteStream(dest, { autoClose:true });

  request.get(url).pipe(file).on('finish', () => {
    console.log('下载完成')
  }).on('error', (err) => {
    console.log('err', err);
  })

}