import express, { Router } from 'express'
import { chatUser } from '../controller/chatController'

const router = express.Router()

router.post('/chat', chatUser)
router.get('/chat/stream', chatUser); 

export const ChatRoutes: Router = router
