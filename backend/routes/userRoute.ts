import express, { Router } from 'express'
import { getUsers, loginUser } from '../controller/userController'
import { authenticateToken } from '../middleware/authen/authMiddleware'

const router = express.Router()

router.get('/getUser', authenticateToken, getUsers)
router.post('/login', loginUser)

export const UserRoutes: Router = router
