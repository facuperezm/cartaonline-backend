import mongoose, { Document } from 'mongoose'

export interface MenuItem {
	name: string
	price: number
	description: string
	image?: string
	category: string
}

export interface MenuDocument extends Document {
	items: MenuItem[]
}

const menuSchema = new mongoose.Schema<MenuDocument>({
	items: [
		{
			name: { type: String, required: true },
			price: { type: Number, required: true },
			description: { type: String },
			image: { type: String },
			category: { type: String, required: true }
		}
	]
})

export default mongoose.model<MenuDocument>('Menu', menuSchema)
