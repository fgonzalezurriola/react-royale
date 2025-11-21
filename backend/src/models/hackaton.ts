import mongoose from 'mongoose'

mongoose.set('strictQuery', false)

interface HackatonSchema {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  startVotingDate: Date
  endVotingDate: Date
  host: mongoose.Types.ObjectId
}

const hackatonSchema = new mongoose.Schema<HackatonSchema>({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
  },
  description: {
    type: String,
    required: true,
    minLength: 10,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  startVotingDate: {
    type: Date,
    required: true,
  },
  endVotingDate: {
    type: Date,
    required: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

hackatonSchema.pre('save', function (next) {
  const now = new Date()
  const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000)

  if (this.startDate < fiveHoursAgo) {
    return next(new Error('Start date cannot be in the past'))
  }
  if (this.startDate >= this.endDate) {
    return next(new Error('End date must be after start date'))
  }
  if (this.endDate > this.startVotingDate) {
    return next(new Error('Voting must start after submission period ends'))
  }
  if (this.startVotingDate >= this.endVotingDate) {
    return next(new Error('Voting end date must be after voting start date'))
  }
  next()
})

hackatonSchema.set('toJSON', {
  transform: (_, returnedObject: { id?: string; _id?: mongoose.Types.ObjectId; __v?: number }) => {
    returnedObject.id = returnedObject._id?.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Hackaton = mongoose.model('Hackaton', hackatonSchema, 'react_royale_hackatons')

export default Hackaton
