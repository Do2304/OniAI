import express, { Router } from 'express'
import { authenticateToken } from '../middleware/authen/authMiddleware'
import { getListConversationId } from '../controller/chatController'

const router = express.Router()

router.get('/conversation', authenticateToken, getListConversationId)

export const ConversationRoutes: Router = router
