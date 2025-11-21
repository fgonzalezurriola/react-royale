import express from 'express'
import Submission from '../models/submission'
import Hackaton from '../models/hackaton'
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
    const { changeVote } = req.body
    const submission = await Submission.findById(req.params.id)
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' })
    }

    // Get the hackaton to check voting period
    const hackaton = await Hackaton.findById(submission.hackatonId)
    if (!hackaton) {
      return res.status(404).json({ error: 'Competition not found' })
    }

    // Check if voting period is active
    const now = new Date()
    const endDate = new Date(hackaton.endDate)
    const startVotingDate = new Date(hackaton.startVotingDate)
    const endVotingDate = new Date(hackaton.endVotingDate)
    const isVotingPeriod = now > endDate && now >= startVotingDate && now <= endVotingDate

    if (!isVotingPeriod) {
      return res.status(400).json({ error: 'Voting is not currently open for this competition' })
    }

    // Check if user has already voted for ANY submission in this competition
    const allSubmissionsInHackaton = await Submission.find({ hackatonId: submission.hackatonId })
    const previouslyVotedSubmission = allSubmissionsInHackaton.find((sub) =>
      sub.voters.some((voterId) => voterId.toString() === req.userId)
    )

    if (previouslyVotedSubmission) {
      // If user wants to change vote
      if (changeVote) {
        // Remove vote from previous submission
        previouslyVotedSubmission.voters = previouslyVotedSubmission.voters.filter(
          (voterId) => voterId.toString() !== req.userId
        )
        previouslyVotedSubmission.votes -= 1
        await previouslyVotedSubmission.save()
      } else {
        // Return error with info about which submission they voted for
        return res.status(400).json({
          error: 'You have already voted in this competition',
          previousVote: {
            id: previouslyVotedSubmission._id.toString(),
            title: previouslyVotedSubmission.title,
          },
        })
      }
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
