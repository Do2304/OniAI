import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()
const client = new OpenAI({
  apiKey: process.env.API_TOKEN,
})

export const chatUser = async (req, res) => {
  const messages = JSON.parse(req.query.messages || '[]')
  const conversationId = req.query.conversationId
  // const conversationId2 = req.query.conversationId2

  const userId = req.query.userId
  console.log('messs:', messages)
  console.log('conversationId:', conversationId)
  // console.log('conversationId2:', conversationId2)
  console.log('userId:', userId)

  try {
    // const conversation = await prisma.conversation.findUnique({
    //   where: { id: conversationId },
    //   include: {
    //     user: true,
    //     messages: true,
    //   },
    // })
    // console.log('conversation-----------', conversation)
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    // })
    // if (!user) {
    //   throw new Error('User not found')
    // }
    const newConversationId = uuidv4()
    if (!conversationId) {
      await prisma.conversation.create({
        data: {
          id: newConversationId,
          title: '',
          user: {
            connect: { id: userId },
          },
        },
      })
      await prisma.message.create({
        data: {
          conversationId: newConversationId,
          content: messages,
          role: 'User',
        },
      })
      // console.log('newConversationId', newConversationId)
      res.setHeader('X-Conversation-ID', newConversationId)
    } else {
      // await prisma.conversation.create({
      //   data: {
      //     id: conversationId,
      //     title: '',
      //     user: {
      //       connect: { id: userId },
      //     },
      //   },
      // })
      await prisma.message.create({
        data: {
          conversationId: conversationId,
          content: messages,
          role: 'User',
        },
      })
      res.setHeader('X-Conversation-ID', conversationId)
    }

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    const responseChatGPT = await client.responses.create({
      model: 'gpt-4o',
      input: messages,
      stream: true,
    })
    let fullMessage = ''
    for await (const event of responseChatGPT) {
      // console.log(event)
      if (event.type === 'response.output_text.delta') {
        // console.log(event.delta)
        const message = event.delta
        if (message) {
          fullMessage += message
          res.write(`data: ${message}\n\n`)
        }
      }
    }
    // console.log(fullMessage)
    //   await prisma.conversation.create({
    //     data: {
    //       userId: infoUserId,
    //       conversationId: conversationId,
    //       content: fullMessage,
    //       role: 'assistant',
    //     },
    //   })
    if (!conversationId) {
      await prisma.message.create({
        data: {
          conversationId: newConversationId,
          content: fullMessage,
          role: 'Assistant',
        },
      })
    } else {
      await prisma.message.create({
        data: {
          conversationId: conversationId,
          content: fullMessage,
          role: 'Assistant',
        },
      })
    }

    res.write('event: end\n\n')
    res.end()
  } catch (error) {
    console.error('Error fetching data from OpenAI:', error)
    res.status(500).send('Error fetching data')
  }
}

export const startConversation = async (req, res) => {
  const infoUser = req.user
  try {
    const conversationId = uuidv4()
    res.json({ conversationId, infoUser })
  } catch (error) {
    console.error('Error starting conversation:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while starting the conversation.' })
  }
}

export const getMessagesByConversationId = async (req, res) => {
  // const { conversationId } = req.params
  // const infoUser = req.user
  console.log('req.user:', req.user)
  try {
    //   const messages = await prisma.conversation.findMany({
    //     where: { conversationId: conversationId, userId: infoUser.id.toString() },
    //     select: { content: true, role: true },
    //   })
    //   if (messages.length === 0) {
    //     return res.status(404).json({ message: 'No messages found' })
    //   }
    //   res.json({ messages, infoUser })
  } catch (error) {
    console.error('Error fetching messages:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching messages.' })
  }
}
