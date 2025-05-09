import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'

const prisma = new PrismaClient()
const client = new OpenAI({
  apiKey: process.env.API_TOKEN,
})

export const chatUser = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  const messages = JSON.parse(req.query.messages || '[]')
  console.log('messs:', messages)
  const lastMessages = messages.slice(-1)
  console.log('lats:', lastMessages)

  try {
    await prisma.conversation.createMany({
      data: lastMessages.map((msg) => ({
        userId: '1',
        content: msg.content,
        role: msg.role,
      })),
    })
    const responseChatGPT = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      stream: true,
    })
    let fullMessage = ''
    for await (const event of responseChatGPT) {
      // console.log(event.choices[0].delta.content)
      const message = event.choices[0]?.delta.content
      if (message) {
        fullMessage += message
        res.write(`data: ${message}\n\n`)
      }
    }
    // console.log(fullMessage)
    await prisma.conversation.create({
      data: {
        userId: '1',
        content: fullMessage,
        role: 'assistant',
      },
    })
    res.write('event: end\n\n')
    res.end()
  } catch (error) {
    console.error('Error fetching data from OpenAI:', error)
    res.status(500).send('Error fetching data')
  }
}
