import express from 'express'
import Hackaton from '../models/hackaton'
import { withUser } from '../utils/middleware'
import User from '../models/user'

const router = express.Router()

// CRUD hackaton ops
// get all hackatons: GET hackatons/
// get hackaton by id: GET hackatons/:id
// create hackaton: POST hackatons/
// delete hackaton: DELETE hackatons/:id
// update hackaton: PUT hackatons/:id

router.get('/', async (_req, res, next) => {
  try {
    const hackatons = await Hackaton.find({}).populate('host', { username: 1, name: 1 })
    res.json(hackatons)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const hackaton = await Hackaton.findById(req.params.id).populate('host', {
      username: 1,
      name: 1,
    })
    if (hackaton) {
      res.json(hackaton)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

router.post('/', withUser, async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, startVotingDate, endVotingDate, hackaton } =
      req.body

    const hostId = req.userId
    if (!hostId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const host = await User.findById(hostId)
    if (!host) {
      return res.status(400).json({ error: 'Host user not found' })
    }

    const newHackaton = new Hackaton({
      title,
      description,
      startDate,
      endDate,
      startVotingDate,
      endVotingDate,
      host,
      hackaton,
    })

    const savedHackaton = await newHackaton.save()
    res.status(201).json(savedHackaton)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', withUser, async (req, res, next) => {
  try {
    const hackatonId = req.params.id
    const hostId = req.userId
    if (!hostId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const hackaton = await Hackaton.findById(hackatonId)
    if (!hackaton) {
      return res.status(404).json({ error: 'Hackaton not found' })
    }

    if (hackaton.host.toString() !== hostId) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    await Hackaton.findByIdAndDelete(hackatonId)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

router.put('/:id', withUser, async (req, res, next) => {
  try {
    const hackatonId = req.params.id
    const updateData = req.body

    const hackaton = await Hackaton.findById(hackatonId)
    if (!hackaton) {
      return res.status(404).json({ error: 'Hackaton not found' })
    }

    if (hackaton.host.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const updatedHackaton = await Hackaton.findByIdAndUpdate(hackatonId, updateData, {
      new: true,
    })
    if (!updatedHackaton) {
      return res.status(404).json({ error: 'Hackaton not found' })
    }

    res.json(updatedHackaton)
  } catch (error) {
    next(error)
  }
})

export default router
