import mongoose from 'mongoose'
import bycrypt from 'bcryptjs'

export interface UserDocument extends Document {
	email: string
	password: string
	name: string
	isAdmin: boolean
	matchPassword: (enteredPassword: string) => Promise<boolean>
	isModified: (password: string) => boolean
}

const userSchema = new mongoose.Schema<UserDocument>(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			unique: true, // no two users can have the same email
			required: true
		},
		password: {
			type: String,
			required: true
		},
		isAdmin: {
			type: Boolean, // only admins can create products
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

	const salt = await bycrypt.genSalt(10)
	user.password = await bycrypt.hash(user.password, salt)
})

userSchema.methods.matchPassword = async function (
	enteredPassword: string
): Promise<boolean> {
	return await bycrypt.compare(enteredPassword, this.password)
}
const User = mongoose.model<UserDocument>('User', userSchema)

export default User
