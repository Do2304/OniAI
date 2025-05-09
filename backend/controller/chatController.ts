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

    response.data.on('data', (chunk) => {
      const data = chunk.toString()
      console.log('Received chunk:', data)
      res.write(`data: ${data}\n\n`)
      //Save database
    })

    response.data.on('end', () => {
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
