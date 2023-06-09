import express from 'express'
import { saveMenu, getMenus } from '../controllers/menuController'

const router = express.Router()

router.route('/menu').post(saveMenu)
router.route('/menus').get(getMenus)

export default router
