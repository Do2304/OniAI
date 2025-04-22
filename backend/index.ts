import express, { Express } from 'express'
import dotenv from 'dotenv'
import main from './routes/indexRoutes'

dotenv.config()
const app: Express = express()
const port: number | string = process.env.PORT
app.use(express.json())

main(app)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
