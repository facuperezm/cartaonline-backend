import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import companyModel, { CompanyDocument } from '../models/companyModel'
import generateToken from '../utils/generateToken'

interface AuthenticatedRequest extends Request {
	company?: CompanyDocument
}

// Esto deberia tener los siguientes controladores
// 1. Crear una empresa (registrarse)
// 2. Obtener todas las empresas (ruta publica, para el home)
// 3. Obtener el perfil de una empresa (ruta privada)
// 4. Actualizar el perfil de una empresa (ruta privada)

// @desc    Save a new company or REGISTER
// @route   POST /api/dashboard
// @access  Public
export const saveCompany = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { companyName, category, phoneNumber, location } = req.body

			const companyExist = await companyModel.findOne({ companyName }) // Check if the company already exists

			if (companyExist) {
				res.status(400)
				throw new Error('Company already exists')
			}

			const newCompany = await companyModel.create({
				companyName,
				category,
				phoneNumber,
				location
			})

			if (newCompany) {
				generateToken(res, newCompany._id.toString())
				res.status(201).json({
					_id: newCompany._id,
					companyName: newCompany.companyName,
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

// @desc    Update company profile
// @route   PUT /api/dashboard/profile
// @access  Private
export const updateCompanyProfile = asyncHandler(
	async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		try {
			const id = req.params.id
			const company = req.company

			if (company && company._id.toString() === id) {
				company.companyName = req.body.companyName || company.companyName
				company.category = req.body.category || company.category
				company.phoneNumber = req.body.phoneNumber || company.phoneNumber
				company.location = req.body.location || company.location

				const updatedCompany = await company.save()

				const companyProfile = {
					_id: updatedCompany._id,
					companyName: updatedCompany.companyName,
					category: updatedCompany.category,
					phoneNumber: updatedCompany.phoneNumber,
					location: updatedCompany.location
				}

				res.status(200).json(companyProfile)
			} else {
				res.status(404).json({ ok: false, message: 'Company not found' })
				throw new Error('Company not found')
			}
		} catch (error: any) {
			res.status(500).json({ ok: false, message: error.message })
			next(error)
		}
	}
)
