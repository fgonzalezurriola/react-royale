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
  bannerUrl: string | null
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
  bannerUrl: {
    type: String,
    default: null,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

hackatonSchema.set('toJSON', {
  transform: (_, returnedObject: { id?: string; _id?: mongoose.Types.ObjectId; __v?: number }) => {
    returnedObject.id = returnedObject._id?.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Hackaton = mongoose.model('Hackaton', hackatonSchema)

export default Hackaton
