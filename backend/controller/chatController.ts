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
      // console.log(data)
      const jsonData = data.startsWith('data: ') ? data.substring(6) : data
      // const jsonData = data.slice(6).trim()
      // const jsonData = data.split('data: ')[1] || ''
      console.log(jsonData)
      if (jsonData === '[DONE]') {
        return
      }
      const messageData = JSON.parse(jsonData)
      console.log(messageData)

      const messageContent = messageData.choices[0].delta.content
      const messageContentFinish = messageData.choices[0].finish_reason
      if (messageContent) {
        fullContent += messageContent
      }
      if (messageContentFinish === 'stop') {
        return
      }
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
