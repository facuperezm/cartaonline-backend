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
	status: 'pending' | 'approved' // Agregar el campo "status" con los posibles valores 'pending' o 'approved'
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
	status: { type: String, default: 'pending' } // Establecer "pending" como valor por defecto
})

export default mongoose.model<MenuDocument>('Menu', menuSchema)
