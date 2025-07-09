import axios from 'axios'
import * as cheerio from 'cheerio'

const crawlWebData = async (query) => {
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
}

export const handleWebSearch = async (message) => {
  const crawlResult = await crawlWebData(message)
  const allContexts = []
  const allLinks = []
  const allTitles = []

  for (const item of crawlResult) {
    const url = item.link
    const title = item.title
    const page = await axios.get(url)
    const $ = cheerio.load(page.data)

    $(
      'script, style, noscript, iframe, svg, canvas, meta, link, head, title, object, embed, picture, source, audio, video, track, map, area, base, param, template, menu, menuitem',
    ).remove()

    const text = $('body').text()
    const cleanText = text.replace(/\s+/g, ' ').trim()
    allContexts.push(cleanText)
    allLinks.push(url)
    allTitles.push(title)
  }

  return (
    `${message}\n\nHere is the context:\n\n` +
    allLinks
      .map(
        (link, index) =>
          `link: ${link}\n\n title: ${allTitles[index]}\n\n context: ${allContexts[index].substring(0, 900)}`,
      )
      .join('\n\n------------------\n\n')
  )
}
