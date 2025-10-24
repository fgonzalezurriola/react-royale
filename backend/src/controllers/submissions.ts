import express from 'express'
import Submission from '../models/submission'
import { withUser } from '../utils/middleware'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const { hackatonId } = req.query
    const filter = hackatonId ? { hackatonId } : {}
    const submissions = await Submission.find(filter)
    res.json(submissions)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
    if (submission) {
      res.json(submission)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

router.post('/', withUser, async (req, res, next) => {
  try {
    const { hackatonId, participantName, title, description, jsxCode } = req.body

    const newSubmission = new Submission({
      hackatonId,
      userId: req.userId,
      participantName,
      title,
      description,
      jsxCode,
    })

    const savedSubmission = await newSubmission.save()
    res.status(201).json(savedSubmission)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', withUser, async (req, res, next) => {
  try {
    const { participantName, title, description, jsxCode, votes } = req.body

    const submission = await Submission.findById(req.params.id)
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    if (submission.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const updatedSubmission = await Submission.findByIdAndUpdate(
      req.params.id,
      { participantName, title, description, jsxCode, votes },
      { new: true, runValidators: true },
    )

    if (updatedSubmission) {
      res.json(updatedSubmission)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', withUser, async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    if (submission.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const deletedSubmission = await Submission.findByIdAndDelete(req.params.id)
    if (deletedSubmission) {
      res.status(204).end()
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

export default router
