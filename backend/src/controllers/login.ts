import express from 'express'
import config from '../utils/config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/user'
import { withUser } from '../utils/middleware'
import logger from '../utils/logger'

const router = express.Router()

router.post('/', async (request, response, next) => {
  try {
    const { username, password } = request.body
    const user = await User.findOne({ username })
    if (user) {
      const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
      if (!passwordCorrect) {
        return response.status(401).json({ error: 'invalid username or password' })
      }
      const userForToken = {
        username: user.username,
        csrf: crypto.randomUUID(),
        id: user._id,
      }
      const token = jwt.sign(userForToken, config.JWT_SECRET, { expiresIn: 60 * 60 })
      response.setHeader('X-CSRF-Token', userForToken.csrf)
      response.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      response.status(200).send({ token, username: user.username, name: user.name })
    } else {
      response.status(401).json({ error: 'invalid username or password' })
    }
  } catch (error) {
    next(error)
  }
})

router.get('/me', withUser, async (request, response, next) => {
  try {
    const user = await User.findById(request.userId)
    response.status(200).json(user)
    logger.info(`User ${request.userId} authenticated successfully`)
  } catch (error) {
    next(error)
  }
})

router.post('/logout', (request, response) => {
  response.clearCookie('token')
  response.status(200).send({
    message: 'Logged out successfully',
  })
  logger.info(`User ${request.userId} logged out successfully`)
})

export default router
