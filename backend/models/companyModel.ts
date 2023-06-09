import mongoose, { Document, Schema } from 'mongoose'
import { MenuDocument } from './menuModel'

export interface Hours {
	dayOfTheWeek: string
	openingHour: string
	closingHour: string
}

export interface CompanyDocument extends Document {
	companyName: string
	name: string
	lastName: string
	email: string
	password: string
	phoneNumber: number
	category:
		| 'restaurant'
		| 'bar'
		| 'cafe'
		| 'bakery'
		| 'fast food'
		| 'internacional'
		| 'panaderia'
		| 'cafeteria'
		| 'barra'
		| 'comida rapida'
		| 'comida italiana'
		| 'comida mexicana'
		| 'comida internacional'
		| 'pasteleria'
		| 'cafeteria'
		| 'cerveceria'
	location: string
	menu?: MenuDocument['_id']
	daysOfOperation?: string[]
	workingHours?: Hours[]
	products?: string[]
}

const companySchema = new Schema<CompanyDocument>({
	companyName: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	category: { type: String, required: true },
	menu: { type: Schema.Types.ObjectId, ref: 'Menu' },
	daysOfOperation: [{ type: String, required: true }],
	workingHours: [{ type: Schema.Types.Mixed, required: true }],
	phoneNumber: { type: Number, unique: true },
	location: { type: String },
	products: [{ type: String, required: true }]
})

export default mongoose.model<CompanyDocument>('Company', companySchema)
