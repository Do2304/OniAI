import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()
const client = new OpenAI({
  apiKey: process.env.API_TOKEN,
})

export const chatUser = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  const messages = JSON.parse(req.query.messages || '[]')
  const conversationId = req.query.conversationId
  console.log('messs:', messages)
  const lastMessages = messages.slice(-1)
  console.log('lats:', lastMessages)

  try {
    await prisma.conversation.createMany({
      data: lastMessages.map((msg) => ({
        userId: '1',
        conversationId: conversationId,
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
        conversationId: conversationId,
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

export const startConversation = async (req, res) => {
  try {
    const conversationId = uuidv4()
    // await prisma.conversation.create({
    //   data: {
    //     conversationId: conversationId,
    //     userId: '1',
    //     content: '',
    //     role: 'system',
    //   },
    // })

    res.json({ conversationId })
  } catch (error) {
    console.error('Error starting conversation:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while starting the conversation.' })
  }
}

export const getMessagesByConversationId = async (req, res) => {
  const { conversationId } = req.params

  try {
    const messages = await prisma.conversation.findMany({
      where: { conversationId: conversationId },
      select: { content: true, role: true },
    })

    if (messages.length === 0) {
      return res.status(404).json({ message: 'No messages found' })
    }

    res.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching messages.' })
  }
}
