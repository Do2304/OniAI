import OpenAI from 'openai'
import { v4 as uuidv4 } from 'uuid'
import Anthropic from '@anthropic-ai/sdk'
import * as conversationService from '../services/conversationService'
import * as messageService from '../services/messageService'
import * as countTokenService from '../services/countTokenService'
import { ChatOpenAIResponse } from '../services/AIService.ts/openAIService'

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
  const selectedModels = req.query.model

  try {
    const conversationExists =
      await conversationService.findConversation(conversationId)
    if (!conversationExists) {
      await conversationService.createNewConversation(conversationId, userId)
    }
    await messageService.createUserMessage(conversationId, messages)

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    let fullMessage = ''
    let totalToken = 0
    switch (selectedModels) {
      case 'claude-1':
      case 'claude-2': {
        const responseChatGPT = await anthropic.messages.create({
          model: selectedModels,
          max_tokens: 1024,
          messages: [{ role: 'user', content: messages }],
        })
        console.log('123', responseChatGPT)

        // fullMessage = msg.completion
        // res.write(`data: ${fullMessage}\n\n`);
        break
      }

      case 'gpt-4.1':
      case 'gpt-4.1-nano':
      case 'gpt-4o':
      case 'o4-mini': {
        const resultChatOpenAIResponse = await ChatOpenAIResponse(
          client,
          selectedModels,
          messages,
          res,
        )
        fullMessage = resultChatOpenAIResponse.fullMessage
        totalToken = resultChatOpenAIResponse.totalToken
        break
      }
    }

    await messageService.createAssistantMessage(conversationId, fullMessage)
    await countTokenService.countUseToken(userId, totalToken)

    res.write(`event: end\n`)
    res.write(`data: done\n\n`)
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
    const messages = await messageService.getMessagesById(
      conversationId,
      infoUser.id.toString(),
    )
    res.json({ messages, infoUser })
  } catch (error) {
    console.error('Error fetching messages:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching messages.' })
  }
}
