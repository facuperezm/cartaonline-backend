import mongoose, { Document } from 'mongoose'

export interface MenuDocument extends Document {
	name: string
	items: string[]
}

const menuSchema = new mongoose.Schema<MenuDocument>({
	name: { type: String, required: true },
	items: [{ type: String, required: true }]
})

export default mongoose.model<MenuDocument>('Menu', menuSchema)
