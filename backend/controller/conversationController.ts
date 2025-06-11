import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getListConversationId = async (req, res) => {
  const infoUser = req.user
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
