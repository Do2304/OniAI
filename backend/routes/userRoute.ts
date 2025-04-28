import express, { Router } from 'express'
import { getUsers, loginUser } from '../controller/userController'
import { authenticateToken } from '../middleware/authen/authMiddleware'
import { validateData } from '../middleware/validationMiddleware'


const router = express.Router()

router.get('/getUser', authenticateToken, getUsers)
router.post('/login', validateData(userLoginSchema), loginUser)

export const UserRoutes: Router = router
