import express from 'express'
import {
	saveCompany,
	getCompanies
} from '../../backend/controllers/CompanyController'

const router = express.Router()

router.route('/company').post(saveCompany)
router.route('/companies').get(getCompanies)

export default router
