import express, { Router } from 'express'
import {
  chatUser,
  getMessagesByConversationId,
  startConversation,
} from '../controller/chatController'

const router = express.Router()

router.post('/chat', chatUser)
router.get('/chat/stream', chatUser)
router.post('/chat/start-conversation', startConversation)
router.get('/chat/:conversationId', getMessagesByConversationId)

export const ChatRoutes: Router = router
