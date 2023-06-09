// companyModel.ts
import mongoose, { Document } from 'mongoose'

export interface Hours {
	dayOfTheWeek: string
	openingHour: string
	closingHour: string
}

export interface CompanyDocument extends Document {
	name: string
	menu: object
	daysOfOperation: string[]
	workingHours: Hours[]
	whatsappNumber: Number
	location: string
	products: string[]
}

const companySchema = new mongoose.Schema<CompanyDocument>({
	name: { type: String, required: true },
	menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
	daysOfOperation: [{ type: String, required: true }],
	workingHours: [{ type: String, required: true }],
	whatsappNumber: { type: Number, unique: true },
	location: { type: String },
	products: [{ type: String, required: true }]
})

export default mongoose.model<CompanyDocument>('Company', companySchema)
