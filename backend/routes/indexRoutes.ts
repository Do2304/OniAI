import { Express } from 'express'
import { UserRoutes } from './userRoute'
import { ChatRoutes } from './chatRoute'
import { ConversationRoutes } from './conversationRoute'
import { TokenRoutes } from './tokenRoute'

const main = (app: Express) => {
  app.use('/v1', UserRoutes)
  app.use('/v1', ChatRoutes)
  app.use('/v1', ConversationRoutes)
  app.use('/v1', TokenRoutes)
}

export default main
