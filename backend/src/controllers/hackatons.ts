import express from 'express'
import Hackaton from '../models/hackaton'
import { withUser } from '../utils/middleware'
import User from '../models/user'

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
router.post('/', withUser, async (req, res) => {
    try {
        const {
            title,
            description,
            startDate,
            endDate,
            startVotingDate,
            endVotingDate,
            bannerUrl,
            hackaton,
        } = req.body

        const hostId = req.userId;
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
