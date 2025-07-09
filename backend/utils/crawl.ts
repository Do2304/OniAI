import axios from 'axios'
// import * as cheerio from 'cheerio'

export const crawlWebData = async (query) => {
  console.log('query', query)
  const response = await axios.get(
    'https://www.googleapis.com/customsearch/v1',
    {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        q: query,
      },
    },
  )
  const items = response.data.items.slice(0, 5)
  return items
  //   console.log('items', items)
  //   let result = []
  //   for (const item of items) {
  //     const url = item.link
  //     const page = await axios.get(url)
  //     console.log('sd', page.data)

  //     const $ = cheerio.load(page.data)
  //     // console.log('$', $)
  //     // const title = $('title').text()
  //     // console.log('title', title)

  //     // const content = $('body').text()
  //     // console.log('con', content.trim())
  //     // console.log('-----------------------------------')

  //     // result.push(content)
  //   }
  //   //   console.log(result)
  //   //   console.log('-----------------------------------')

  //   return result
}
