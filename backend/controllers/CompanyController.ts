import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import companyModel from '../models/companyModel'
import jwt from 'jsonwebtoken'
import generateToken from '../utils/generateToken'

// @desc    Save a new company
// @route   POST /api/dashboard
// @access  Public
export const saveCompany = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const {
				companyName,
				name,
				lastName,
				email,
				password,
				category,
				phoneNumber,
				location
			} = req.body

			const companyExist = await companyModel.findOne({ email }) // Check if the company already exists

			if (companyExist) {
				res.status(400)
				throw new Error('Company already exists')
			}

			const newCompany = await companyModel.create({
				companyName,
				name,
				lastName,
				email,
				password,
				category,
				phoneNumber,
				location
			})

			if (newCompany) {
				generateToken(res, newCompany._id.toString())
				res.status(201).json({
					_id: newCompany._id,
					companyName: newCompany.companyName,
					name: newCompany.name
				})
			} else {
				res.status(400)
				throw new Error('Invalid company data')
			}
			res.status(201).json({ message: 'Company saved successfully' })
		} catch (error) {
			console.error(error)
			next(error)
		}
	}
)

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private or Public
export const getCompanies = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const companies = await companyModel.find()

			res.json(companies)
		} catch (error) {
			console.error(error)
			next(error)
		}
	}
)

// @desc    Login a company
// @route   POST /api/company/login
// @access  Public
export const loginCompany = asyncHandler(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { email, password } = req.body

			// Verify user credentials
			const company = await companyModel.findOne({ email, password })

			if (!company) {
				res.status(401).json({ message: 'Invalid credentials' })
				return
			}

			// Generate JWT token
			const token = jwt.sign(
				{ companyId: company._id },
				process.env.JWT_SECRET!
			)

			// Set the token in a cookie
			res.cookie('token', token, { httpOnly: true })

			res.json({ message: 'Login successful' })
		} catch (error) {
			console.error(error)
			next(error)
		}
	}
)

// @desc    Logout company
// @route   GET /api/dashboard/logout
// @access  Private
export const logoutCompany = asyncHandler(
	async (req: Request, res: Response) => {
		res.cookie('jwt', '', {
			httpOnly: true,
			expires: new Date(0),
			secure: process.env.NODE_ENV === 'production'
		})

		res.status(200).json({ message: 'Company logged out!' })
	}
)
