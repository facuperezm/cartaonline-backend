import mongoose from 'mongoose'

const connectDB = async () => {
	try {
		const mongoURI = process.env.MONGO_URI
		if (!mongoURI) {
			throw new Error(
				'Please define the MONGO_URI environment variable inside .env.local'
			)
		}

		const conn = await mongoose.connect(mongoURI)
		console.log(`MongoDB Connected to this: ${conn.connection.host}`)
	} catch (error: any) {
		console.error(`Error!!! ${error.message}`)
		process.exit(1)
	}
}

export default connectDB
