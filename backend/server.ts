import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/userRoutes'
import companyRoutes from './routes/companyRoutes'
import menuRoutes from './routes/menuRoutes'
import { errorHandler, notFound } from './middleware/errorMiddleware'
import connectDB from './config/db'

dotenv.config()
connectDB()

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({ origin: true, credentials: true }))

// Routes
app.use('/api/dashboard', companyRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/users', userRoutes)

// Hello World route
app.get('/', (req, res) => {
	res.send('Hello World!')
})

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`)
})
