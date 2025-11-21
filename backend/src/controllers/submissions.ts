import express from 'express'
import Submission from '../models/submission'
import { withUser, optionalUser } from '../utils/middleware'

const router = express.Router()

router.get('/', optionalUser, async (req, res, next) => {
  try {
    const { hackatonId } = req.query
    const filter = hackatonId ? { hackatonId } : {}
    const submissions = await Submission.find(filter)

    // Add hasVoted field for each submission
    const submissionsWithVoteStatus = submissions.map((submission) => {
      const submissionObj = submission.toJSON()
      return {
        ...submissionObj,
        hasVoted: req.userId ? submission.voters.some(voterId => voterId.toString() === req.userId) : false,
      }
    })

    res.json(submissionsWithVoteStatus)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', optionalUser, async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
    if (submission) {
      const submissionObj = submission.toJSON()
      res.json({
        ...submissionObj,
        hasVoted: req.userId ? submission.voters.some(voterId => voterId.toString() === req.userId) : false,
      })
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
    const submissionObj = savedSubmission.toJSON()
    res.status(201).json({
      ...submissionObj,
      hasVoted: false,
    })
  } catch (error) {
    next(error)
  }
})

router.put('/:id', withUser, async (req, res, next) => {
  try {
    const { participantName, title, description, jsxCode } = req.body

    const submission = await Submission.findById(req.params.id)
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    if (submission.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const updatedSubmission = await Submission.findByIdAndUpdate(
      req.params.id,
      { participantName, title, description, jsxCode },
      { new: true, runValidators: true },
    )

    if (updatedSubmission) {
      const submissionObj = updatedSubmission.toJSON()
      res.json({
        ...submissionObj,
        hasVoted: updatedSubmission.voters.some(voterId => voterId.toString() === req.userId),
      })
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

router.post('/:id/vote', withUser, async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    // Check if user already voted
    const hasVoted = submission.voters.some((voterId) => voterId.toString() === req.userId)
    if (hasVoted) {
      return res.status(400).json({ error: 'You have already voted for this submission' })
    }

    // Add user to voters and increment vote count
    submission.voters.push(req.userId as any)
    submission.votes += 1
    await submission.save()

    const submissionObj = submission.toJSON()
    res.json({
      ...submissionObj,
      hasVoted: true,
    })
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
