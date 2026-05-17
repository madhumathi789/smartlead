import express, { Application } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import leadRoutes from './routes/leads'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app: Application = express()

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (_req, res) => {
  res.send('SmartLead API is running...')
})

app.use('/api/auth', authRoutes)
app.use('/api/leads', leadRoutes)

app.use(errorHandler)

export default app