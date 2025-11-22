import { MongoClient, ObjectId } from 'mongodb'

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dev'
const mongoDbName = process.env.MONGODB_DBNAME || 'dev'

let client: MongoClient | null = null

const getDb = async () => {
  if (!client) {
    client = new MongoClient(mongoUri)
    await client.connect()
  }
  return client.db(mongoDbName)
}

export const seedVotingHackathon = async () => {
  const db = await getDb()
  const hackatons = db.collection('react_royale_hackatons')
  const submissions = db.collection('react_royale_submissions')
  const users = db.collection('react_royale_users')

  const now = new Date()
  const startDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
  const endDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
  const startVotingDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
  const endVotingDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

  const hostResult = await users.findOneAndUpdate(
    { username: 'playwright-host' },
    {
      $setOnInsert: {
        name: 'Playwright Host',
        passwordHash: 'test-hash',
        submissions: [],
      },
    },
    { upsert: true, returnDocument: 'after' }
  )

  const participantResult = await users.findOneAndUpdate(
    { username: 'playwright-participant' },
    {
      $setOnInsert: {
        name: 'Playwright Participant',
        passwordHash: 'test-hash',
        submissions: [],
      },
    },
    { upsert: true, returnDocument: 'after' }
  )

  const hackatonId = new ObjectId()
  const submissionId = new ObjectId()

  const hackatonTitle = 'Playwright Voting Hackathon'
  const submissionTitle = 'Sample Voting Submission'

  await hackatons.deleteMany({ title: hackatonTitle })
  await submissions.deleteMany({ title: submissionTitle })

  await hackatons.insertOne({
    _id: hackatonId,
    title: hackatonTitle,
    description: 'Hackathon seeded for Playwright voting test',
    startDate,
    endDate,
    startVotingDate,
    endVotingDate,
    host: hostResult.value?._id || new ObjectId(),
  })

  await submissions.insertOne({
    _id: submissionId,
    hackatonId,
    userId: participantResult.value?._id || new ObjectId(),
    participantName: 'Playwright Participant',
    title: submissionTitle,
    description: 'Submission seeded for voting flow test',
    jsxCode: '<button style="padding: 8px 16px;">Hello voters!</button>',
    submissionDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
    votes: 0,
    voters: [],
  })

  return {
    hackatonId: hackatonId.toHexString(),
    submissionId: submissionId.toHexString(),
    hackatonTitle,
    submissionTitle,
  }
}

export const cleanupVotingHackathon = async (hackatonId: string) => {
  const db = await getDb()
  const hackatons = db.collection('react_royale_hackatons')
  const submissions = db.collection('react_royale_submissions')

  const hackatonObjectId = new ObjectId(hackatonId)
  await hackatons.deleteOne({ _id: hackatonObjectId })
  await submissions.deleteMany({ hackatonId: hackatonObjectId })
}

export const closeDb = async () => {
  if (client) {
    await client.close()
    client = null
  }
}
