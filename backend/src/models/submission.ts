import mongoose from 'mongoose'

mongoose.set('strictQuery', false)

interface SubmissionSchema {
  id: string
  hackatonId: number
  participantName: string
  participantEmail: string
  title: string
  description?: string
  jsxCode: string
  submissionDate: Date
  votes: number
  status: 'pending' | 'approved' | 'rejected'
}

const submissionSchema = new mongoose.Schema<SubmissionSchema>(
  {
    hackatonId: {
      type: Number,
      required: true,
      index: true,
    },
    participantName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    participantEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 1000,
    },
    jsxCode: {
      type: String,
      required: true,
      minLength: 10,
    },
    submissionDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

submissionSchema.set('toJSON', {
  transform: (_, returnedObject: { id?: string; _id?: mongoose.Types.ObjectId; __v?: number }) => {
    returnedObject.id = returnedObject._id?.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Submission = mongoose.model('Submission', submissionSchema)

export default Submission
