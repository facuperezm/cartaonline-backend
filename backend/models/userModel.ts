import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface UserDocument extends Document {
	_id: string
	email: string
	password: string
	name: string
	company: Schema.Types.ObjectId
	isAdmin: boolean
	matchPassword: (enteredPassword: string) => Promise<boolean>
}

const userSchema = new mongoose.Schema<UserDocument>(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			unique: true,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		company: {
			type: Schema.Types.ObjectId,
			ref: 'Company'
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false
		}
	},
	{
		timestamps: true
	}
)

userSchema.pre<UserDocument>('save', async function (next) {
	const user = this

	if (!user.isModified('password')) {
		next()
	}

	const salt = await bcrypt.genSalt(10)
	user.password = await bcrypt.hash(user.password, salt)
})

userSchema.methods.matchPassword = async function (
	enteredPassword: string
): Promise<boolean> {
	return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model<UserDocument>('User', userSchema)

export default User
