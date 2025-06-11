import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const CreateNewConversation = async (
  conversationId: string,
  userId: string,
) => {
  const conversationExists = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
  })

  if (!conversationExists) {
    await prisma.conversation.create({
      data: {
        id: conversationId,
        title: 'New Chat',
        user: {
          connect: { id: userId },
        },
      },
    })
  }
}
