import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const SECRET_KEY = process.env.JWT_SECRET || 'luli'

export const getUsers = async (req, res) => {
  try {
    const userId = req.user.id // Lấy ID từ token
    console.log("req.user",req.user);   
    console.log('userId', userId)
    console.log('======================')

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user) // Trả về thông tin người dùng hiện tại
  } catch (error) {
    console.error('Error fetching user', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

export const loginUser = async (req, res) => {
  const { email, name } = req.body
  try {
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name,
          email: email,
        },
      })
    }
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: '1h',
    })
    res.json({ token })
  } catch (error) {
    console.error('Error logging in', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}
