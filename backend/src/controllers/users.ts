import express from 'express'
import User from '../models/user'
import { withUser } from '../utils/middleware'
import bcrypt from 'bcrypt'

const router: express.Router = express.Router()

router.get('/', async (_req, res, next) => {
  try {
    const users = await User.find({}).populate('submissions', { content: 1, hackaton: 1 })
    res.json(users)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('submissions', {
      content: 1,
      hackaton: 1,
    })
    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', withUser, async (req, res, next) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id)
    if (deletedUser) {
      res.status(204).end()
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    next(error)
  }
})

router.put('/:id', withUser, async (req, res, next) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const { username, name } = req.body
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, name },
      {
        new: true,
        runValidators: true,
      },
    )

    if (updatedUser) {
      res.json(updatedUser)
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    next(error)
  }
})

export default router
