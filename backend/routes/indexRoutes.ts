import { Express } from 'express'
import { UserRoutes } from './userRoute'
import { ChatRoutes } from './chatRoute'

const main = (app: Express) => {
  app.use('/v1', UserRoutes)
  app.use('/v1', ChatRoutes)
}

export default main
