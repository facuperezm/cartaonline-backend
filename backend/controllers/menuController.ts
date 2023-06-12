import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import Menu from '../models/menuModel'

// @desc    Save a new menu
// @route   POST /api/menu
// @access  Public
export const saveMenu = asyncHandler(async (req: Request, res: Response) => {
	const { name, items } = req.body

	const newMenu = new Menu({
		name,
		items,
		status: 'pending' // Agregar el campo "status" y establecerlo como "pending"
	})

	await newMenu.save()

	res.status(201).json({ message: 'Menu saved successfully' })
})

// @desc    Get all menus
// @route   GET /api/menus
// @access  Public
export const getMenus = asyncHandler(async (req: Request, res: Response) => {
	const menus = await Menu.find()

	res.json(menus)
})
