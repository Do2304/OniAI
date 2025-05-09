import axios from 'axios'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const chatUser = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  const messages = JSON.parse(req.query.messages || '[]')
  console.log('messs:', messages)

  try {
    await prisma.conversation.createMany({
      data: messages.map((msg) => ({
        userId: '1',
        content: msg.content,
        role: msg.role,
      })),
    })
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        stream: true,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
          responseType: 'stream',
        },
        responseType: 'stream',
      },
    )
    let fullContent = ''
    response.data.on('data', (chunk) => {
      const data = chunk.toString()
      // console.log('Received chunk:', data)
      res.write(`data: ${data}\n\n`)

      //Save database
      // console.log('-----------')
      // console.log(data)
      // console.log('----------')
      const jsonData1 = data
        .replace(/^data: /, '')
        .replace(/\n+/g, '\n')
        .trim()
      // console.log('xxxxxxx-------')
      // console.log(jsonData1)
      // console.log('xxxxxxx-------')
      const parts = jsonData1.split('\n')
      parts.forEach((part) => {
        const jsonDataString = part.startsWith('data: ')
          ? part.replace(/^data: /, '')
          : part
        // console.log(jsonDataString)
        try {
          const jsonData = JSON.parse(jsonDataString.trim())
          const content = jsonData.choices[0]?.delta?.content || ''
          fullContent += content
          // console.log(fullContent)
        } catch (error) {
          console.error('Error parsing JSON:', error)
        }
      })
    })

    response.data.on('end', async () => {
      await prisma.conversation.create({
        data: {
          userId: '1',
          content: fullContent,
          role: 'assistant',
        },
      })
      res.end()
    })

    response.data.on('error', (error) => {
      console.error('Stream error:', error)
      res.status(500).send('Error fetching data')
    })
  } catch (error) {
    console.error('Error fetching data from OpenAI:', error)
    res.status(500).send('Error fetching data')
  }
}
