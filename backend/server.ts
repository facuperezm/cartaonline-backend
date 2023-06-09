import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes'
import companyRoutes from './routes/companyRoutes'
import menuRoutes from './routes/menuRoutes'
import { errorHandler, notFound } from './middleware/errorMiddleware'
import connectDB from './config/db'
import cookieParser from 'cookie-parser'
dotenv.config()

const port = process.env.PORT || 5000
connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/dashboard', companyRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
