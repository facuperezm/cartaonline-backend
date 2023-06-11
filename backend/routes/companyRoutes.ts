import express from 'express'
import {
	saveCompany,
	getCompanies,
	logoutCompany,
	loginCompany
} from '../controllers/companyController'
import { protect } from '../middleware/authMiddleware'

const router = express.Router()

router.route('/').post(saveCompany)
router.route('/companies').get(getCompanies)
router.route('/auth').post(loginCompany)
router.route('/logout').get(protect, logoutCompany)

export default router
