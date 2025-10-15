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
    const { hackatonId, participantName, participantEmail, title, description, jsxCode } = req.body

    const newSubmission = new Submission({
      hackatonId,
      participantName,
      participantEmail,
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
    const { participantName, participantEmail, title, description, jsxCode, votes, status } =
      req.body

    const updatedSubmission = await Submission.findByIdAndUpdate(
      req.params.id,
      { participantName, participantEmail, title, description, jsxCode, votes, status },
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
