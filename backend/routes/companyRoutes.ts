import express from 'express'
import {
	saveCompany,
	getCompanies
} from '../../backend/controllers/CompanyController'
import { protect } from '../middleware/authMiddleware'

const router = express.Router()

router.route('/company').post(protect, saveCompany)
router.route('/companies').get(protect, getCompanies)

export default router
