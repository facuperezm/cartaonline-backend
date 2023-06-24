import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import companyModel, { CompanyDocument } from '../models/companyModel'
import jwt from 'jsonwebtoken'
import generateToken from '../utils/generateToken'

interface AuthenticatedRequest extends Request {
	company?: CompanyDocument
}

// Esto deberia tener los siguientes controladores
// 1. Crear una empresa (registrarse)
// 2. Login de una empresa (con email y password)
// 3. Logout de una empresa (destruir la cookie, ruta privada)
// 4. Obtener todas las empresas (ruta publica, para el home)

// @desc    Save a new company or REGISTER
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
					name: newCompany.name,
					message: 'Company created successfully'
				})
			} else {
				res.status(400)
				throw new Error('Invalid company data')
			}
			res.status(201).json()
		} catch (error: any) {
			res.status(500).json({ ok: false, message: error.message })
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

			res.status(200).json({ ok: true, data: companies })
		} catch (error: any) {
			res.status(500).json({ ok: false, message: error.message })
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
			// const token = jwt.sign(
			// 	{ companyId: company._id },
			// 	process.env.JWT_SECRET!
			// )
			let token = generateToken(res, company._id.toString())

			// Set the token in a cookie
			res.cookie('token', token, { httpOnly: true })

			res.json({ message: 'Login successful' })
		} catch (error: any) {
			res.status(500).json({ ok: false, message: error.message })
			next(error)
		}
	}
)

// @desc    Logout company
// @route   GET /api/dashboard/logout
// @access  Private
export const logoutCompany = asyncHandler(
	async (req: Request, res: Response) => {
		res.cookie('token', '', {
			httpOnly: true,
			expires: new Date(0),
			secure: process.env.NODE_ENV === 'production'
		})

		res.status(200).json({ message: 'Company logged out!' })
	}
)

// @desc    Get company profile
// @route   GET /api/dashboard/profile
// @access  Private
export const getCompanyProfile = asyncHandler(
	async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		const company = req.company

		if (company) {
			const companyProfile = {
				_id: company._id,
				companyName: company.companyName,
				name: company.name,
				lastName: company.lastName,
				email: company.email,
				category: company.category,
				phoneNumber: company.phoneNumber,
				location: company.location
			}

			res.status(200).json(companyProfile)
		} else {
			res.status(404).json({ ok: false, message: 'Company not found' })
			throw new Error('Company not found')
		}
	}
)
