import express, { Router } from 'express'
import { chatUser } from '../controller/chatController'

const router = express.Router()

router.post('/chat', chatUser)

export const ChatRoutes: Router = router
