import express from 'express'
import mongoose from 'mongoose'
import config from './utils/config'
import logger from './utils/logger'
import cookieParser from 'cookie-parser'
import middleware from './utils/middleware'
import usersRouter from './controllers/users'
import hackatonsRouter from './controllers/hackatons'
import submissionsRouter from './controllers/submissions'
import loginRouter from './controllers/login'
import cors from 'cors'
import path from 'path'

const staticRoot = path.resolve(__dirname, '../../dist')
const app: express.Application = express()

mongoose.set('strictQuery', false)

app.use(cors({ origin: config.CORS_ORIGINS, credentials: true }))

app.use((_req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'",
  )
  next()
})

if (config.MONGODB_URI) {
  mongoose.connect(config.MONGODB_URI, { dbName: config.MONGODB_DBNAME }).catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })
}

app.use(express.static(staticRoot))
app.use(express.json())
app.use(cookieParser())
app.use(middleware.requestLogger)

app.use('/api/hackatons', hackatonsRouter)
app.use('/api/submissions', submissionsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(staticRoot, 'index.html'))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
