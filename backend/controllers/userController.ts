import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import User, { UserDocument } from '../models/userModel'
import generateToken from '../utils/generateToken'

interface AuthenticatedRequest extends Request {
	user?: UserDocument
}

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body

	const user = await User.findOne({ email })

	if (user && (await user.matchPassword(password))) {
		generateToken(res, user._id.toString())
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email
		})
	} else {
		res.status(400)
		throw new Error('Invalid email or password')
	}
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
	const { name, email, password } = req.body

	const userExists = await User.findOne({ email })

	if (userExists) {
		res.status(400)
		throw new Error('User already exists')
	}

	const user = await User.create({
		name,
		email,
		password
	})

	if (user) {
		generateToken(res, user._id.toString())
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email
		})
	} else {
		res.status(400)
		throw new Error('Invalid user data')
	}
})

// @desc    Logout user
// @route   GET /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
	res.cookie('jwt', '', {
		httpOnly: true,
		expires: new Date(0),
		secure: process.env.NODE_ENV === 'production'
	})

	res.status(200).json({ message: 'User logged out!' })
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const user = req.user

		if (user) {
			const userProfile = {
				_id: user._id,
				name: user.name,
				email: user.email
			}

			res.status(200).json(userProfile)
		} else {
			res.status(404)
			throw new Error('User not found')
		}
	}
)

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		const user = await User.findById(req.user?._id)

		if (user) {
			user.name = req.body.name || user.name
			user.email = req.body.email || user.email

			if (req.body.password) {
				user.password = req.body.password
			}

			const updatedUser = await user.save()

			res.status(200).json({
				_id: updatedUser._id,
				name: updatedUser.name,
				email: updatedUser.email
			})
		} else {
			res.status(404)
			throw new Error('User not found')
		}
	}
)

export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile }
