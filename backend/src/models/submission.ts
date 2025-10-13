import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'

mongoose.set('strictQuery', false)

interface SubmissionSchema {
  id: string
  content: string
  user: mongoose.Types.ObjectId
  hackaton: mongoose.Types.ObjectId
}

const submissionSchema = new mongoose.Schema<SubmissionSchema>({
  content: {
    type: String,
    minLength: 5,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  hackaton: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hackaton',
  },
})

submissionSchema.set('toJSON', {
  transform: (_, returnedObject: { id?: string; _id?: mongoose.Types.ObjectId; __v?: number }) => {
    returnedObject.id = returnedObject._id?.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Submission = mongoose.model('Submission', submissionSchema)

export default Submission
