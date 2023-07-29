import mongoose, { Document, Schema } from 'mongoose'
import { MenuDocument } from './menuModel'

export interface WorkingHours {
	dayOfTheWeek: string
	openingHour: string
	closingHour: string
}

export interface CompanyDocument extends Document {
	companyName: string
	phoneNumber: number
	category: string
	location: string
	menu?: Schema.Types.ObjectId | MenuDocument
	daysOfOperation?: string[]
	workingHours?: WorkingHours[]
	products?: string[]
	createdBy?: Schema.Types.ObjectId
}

const workingHoursSchema = new Schema<WorkingHours>({
	dayOfTheWeek: { type: String, required: true },
	openingHour: { type: String, required: true },
	closingHour: { type: String, required: true }
})

const companySchema = new Schema<CompanyDocument>({
	companyName: { type: String, required: true, unique: true },
	category: { type: String, required: true },
	daysOfOperation: [{ type: String }],
	workingHours: [workingHoursSchema],
	phoneNumber: { type: Number, unique: true },
	location: { type: String },
	products: [{ type: String, required: true }],
	menu: { type: Schema.Types.ObjectId, ref: 'Menu' },
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
})

export default mongoose.model<CompanyDocument>('Company', companySchema)
