import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel'
import generateToken from '../utils/generateToken'

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
const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
	res.status(200).json({ message: 'Get user profile' })
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
	res.status(200).json({ message: 'Update user profile' })
})

export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile }
