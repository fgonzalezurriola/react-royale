import { NextFunction, Request, Response } from 'express'
import logger from './logger'
import jwt from 'jsonwebtoken'
import config from './config'

const requestLogger = (request: Request, _response: Response, next: NextFunction) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (_request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (
  error: { name: string; message: string },
  _request: Request,
  response: Response,
  next: NextFunction,
) => {
  logger.error(error.message)
  logger.error(error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'invalid token' })
  }

  return response.status(500).json({ error: 'Internal server error' })
}

export const withUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req
    const token = req.cookies?.token
    if (!token) {
      res.status(401).json({ error: 'missing token' })
    } else {
      const decodedToken = jwt.verify(token, config.JWT_SECRET)
      const csrfToken = req.headers['x-csrf-token']
      if (typeof decodedToken === 'object' && decodedToken.id && decodedToken.csrf == csrfToken) {
        authReq.userId = decodedToken.id
        next()
      } else {
        res.status(401).json({ error: 'invalid token' })
      }
    }
  } catch (error) {
    res.status(401).json({ error: `invalid token` })
  }
}

export const optionalUser = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req
    const token = req.cookies?.token
    if (token) {
      const decodedToken = jwt.verify(token, config.JWT_SECRET)
      const csrfToken = req.headers['x-csrf-token']
      if (typeof decodedToken === 'object' && decodedToken.id && decodedToken.csrf == csrfToken) {
        authReq.userId = decodedToken.id
      }
    }
  } catch (error) {
    // Invalid token, but we don't block the request
  }
  next()
}

export default { requestLogger, unknownEndpoint, errorHandler }
