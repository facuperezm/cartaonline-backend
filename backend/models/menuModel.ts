import mongoose, { Document, Schema } from 'mongoose'

export interface MenuItem {
	name: string
	price: number
	description: string
	image?: string
	category: string
}

export interface MenuDocument extends Document {
	items: MenuItem[]
	status: 'pending' | 'approved'
	creator: Schema.Types.ObjectId
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
	],
	creator: { type: Schema.Types.ObjectId, ref: 'Company' },
	status: { type: String, default: 'pending' }
})

export default mongoose.model<MenuDocument>('Menu', menuSchema)
