import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import companyModel from '../models/companyModel'
import jwt from 'jsonwebtoken'

// @desc    Save a new company
// @route   POST /api/company
// @access  Public
export const saveCompany = asyncHandler(async (req: Request, res: Response) => {
	try {
		const { name, products, email, password } = req.body

		const newCompany = new companyModel({
			name,
			products,
			email,
			password
		})

		await newCompany.save()

		res.status(201).json({ message: 'Company saved successfully' })
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Error saving the company' })
	}
})

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
export const getCompanies = asyncHandler(
	async (req: Request, res: Response) => {
		try {
			const companies = await companyModel.find()

			res.json(companies)
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: 'Error getting the companies' })
		}
	}
)

// @desc    Login a company
// @route   POST /api/company/login
// @access  Public
export const login = asyncHandler(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { username, password } = req.body

			// Verify user credentials
			const company = await companyModel.findOne({ username, password })

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
			res.status(500).json({ message: 'Error logging in' })
		}
	}
)
