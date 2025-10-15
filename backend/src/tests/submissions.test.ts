import supertest from 'supertest'
import test, { after, beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import app from '../../src/app'
import mongoose from 'mongoose'
import User from '../models/user'

const api = supertest(app)

describe('megabonk (todo)', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  describe('', () => {
    test('bonk bonk megabonk', async () => {
      assert(true)
    })
  })

  after(async () => {
    await User.deleteMany({})
    mongoose.connection.close()
  })
})
