import mongoose from 'mongoose'

interface UserData {
  id: string
  username: string
  name: string
  passwordHash: string
  submissions: mongoose.Types.ObjectId[]
}

const userSchema = new mongoose.Schema<UserData>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 3,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  submissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (
    _,
    returnedObject: {
      id?: string
      _id?: mongoose.Types.ObjectId
      __v?: number
      passwordHash?: string
    },
  ) => {
    returnedObject.id = returnedObject._id?.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

const User = mongoose.model('User', userSchema, 'react_royale_users')
export default User
