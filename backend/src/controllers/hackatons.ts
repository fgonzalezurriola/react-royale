import express from 'express'
import Hackaton from '../models/hackaton'

const router = express.Router()

// GET all hackatons
router.get('/', async (req, res) => {
  const hackatons = await Hackaton.find({}).populate('host', { username: 1, name: 1 })
  res.json(hackatons)
})

// GET single hackaton
router.get('/:id', async (req, res) => {
  const hackaton = await Hackaton.findById(req.params.id).populate('host', { username: 1, name: 1 })
  if (hackaton) {
    res.json(hackaton)
  } else {
    res.status(404).end()
  }
})

// POST create a new hackaton
router.post('/', async (req, res) => {
  try {
    const { title, description, startDate, endDate, startVotingDate, endVotingDate, bannerUrl, host, hackaton } =
      req.body

    const newHackaton = new Hackaton({
      title,
      description,
      startDate,
      endDate,
      startVotingDate,
      endVotingDate,
      bannerUrl,
      host,
      hackaton,
    })

    const savedHackaton = await newHackaton.save()
    res.status(201).json(savedHackaton)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
