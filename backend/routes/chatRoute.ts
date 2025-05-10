import express, { Router } from 'express'
import { chatUser, startConversation } from '../controller/chatController'

const router = express.Router()

router.post('/chat', chatUser)
router.get('/chat/stream', chatUser)
router.post('/chat/start-conversation', startConversation)

export const ChatRoutes: Router = router
