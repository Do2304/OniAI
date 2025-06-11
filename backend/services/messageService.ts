import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const createUserMessage = async (
  conversationId: string,
  messages: string,
) => {
  await prisma.message.create({
    data: {
      conversationId: conversationId,
      content: messages,
      role: 'User',
    },
  })
}

export const createAssistantMessage = async (
  conversationId: string,
  fullMessage: string,
) => {
  await prisma.message.create({
    data: {
      conversationId: conversationId,
      content: fullMessage,
      role: 'Assistant',
    },
  })
}
