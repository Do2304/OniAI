import express, { Router } from 'express'
import { authenticateToken } from '../middleware/authen/authMiddleware'
import {
  getListConversationId,
  renameConversation,
} from '../controller/chatController'

const router = express.Router()

router.get('/conversation', authenticateToken, getListConversationId)
router.put('/rename-conversation', authenticateToken, renameConversation)

export const ConversationRoutes: Router = router
