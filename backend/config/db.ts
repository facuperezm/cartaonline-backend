import mongoose from 'mongoose'

const connectDB = async () => {
	if (!process.env.MONGO_URI) {
		throw new Error(
			'Please define the MONGO_URI environment variable inside .env.local'
		)
	}
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI || '')
		console.log(`MongoDB Connected: ${conn.connection.host}`)
	} catch (error: any) {
		console.error(`Error: ${error.message}`)
		process.exit(1)
	}
}

export default connectDB
