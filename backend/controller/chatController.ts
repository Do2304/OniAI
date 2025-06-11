import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'
import { v4 as uuidv4 } from 'uuid'
import Anthropic from '@anthropic-ai/sdk'
import * as conversationService from '../services/conversationService'
import * as messageService from '../services/messageService'
import { ChatOpenAIResponse } from '../services/AIService.ts/openAIService'

const prisma = new PrismaClient()
const client = new OpenAI({
  apiKey: process.env.API_TOKEN,
})
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
})

export const chatUser = async (req, res) => {
  const messages = JSON.parse(req.query.messages || '[]')
  const conversationId = req.query.conversationId
  const userId = req.query.userId
  const selectedModel = req.query.model

  try {
    await conversationService.CreateNewConversation(conversationId, userId)
    await messageService.createUserMessage(conversationId, messages)

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    let fullMessage = ''
    if (selectedModel.startsWith('claude')) {
      const responseChatGPT = await anthropic.messages.create({
        model: selectedModel,
        max_tokens: 1024,
        messages: [{ role: 'user', content: messages }],
      })
      console.log('123', responseChatGPT)

      // fullMessage = msg.completion
      // res.write(`data: ${fullMessage}\n\n`)
    } else {
      fullMessage = await ChatOpenAIResponse(
        client,
        selectedModel,
        messages,
        res,
      )
    }

    await messageService.createAssistantMessage(conversationId, fullMessage)

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
  const { conversationId } = req.params
  const infoUser = req.user
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
        conversation: {
          userId: infoUser.id.toString(),
        },
      },
      select: {
        content: true,
        role: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
    if (messages.length === 0) {
      return res.status(404).json({ message: 'No messages found' })
    }
    res.json({ messages, infoUser })
  } catch (error) {
    console.error('Error fetching messages:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching messages.' })
  }
}

export const getListConversationId = async (req, res) => {
  const infoUser = req.user
  console.log('User ID:', infoUser.id)
  try {
    const listConversationId = await prisma.conversation.findMany({
      where: {
        user: {
          id: infoUser.id.toString(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        title: true,
        id: true,
      },
    })
    console.log('----', listConversationId)

    res.json({ listConversationId, infoUser })
  } catch (error) {
    console.error('Error fetching list conversationId:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching list conversationId.' })
  }
}

export const renameConversation = async (req, res) => {
  const { id, newTitle } = req.body
  console.log('id', id, newTitle)

  try {
    const getConversationId = await prisma.conversation.findUnique({
      where: { id: id },
    })
    if (!getConversationId) {
      return res.status(404).json({ error: 'Conversation not found' })
    }
    const updatedConversation = await prisma.conversation.update({
      where: { id: id },
      data: { title: newTitle },
    })

    res.json(updatedConversation)
  } catch (error) {
    console.error('Error updating conversation title:', error)
    res.status(500).json({
      error: 'An error occurred while updating the conversation title.',
    })
  }
}

export const deleteConversation = async (req, res) => {
  const { id } = req.params

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: id },
    })
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }
    await prisma.message.deleteMany({
      where: { conversationId: id },
    })
    await prisma.conversation.delete({
      where: { id: id },
    })

    res.status(200).json({ message: 'Conversation deleted successfully' })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the conversation.' })
  }
}
