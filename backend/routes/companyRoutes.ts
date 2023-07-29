import express from 'express'
import {
	saveCompany,
	getCompanies,
	getCompanyProfile
} from '../controllers/CompanyController'
import { protect } from '../middleware/authMiddleware'

const router = express.Router()

router.route('/').post(saveCompany)
router.route('/companies').get(getCompanies)
router.route('/company').get(protect, getCompanyProfile)
router.route('/company/:id').get(protect, getCompanyProfile)

export default router
