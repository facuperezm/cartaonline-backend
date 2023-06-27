import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User, { UserDocument } from '../models/userModel'

interface AuthenticatedRequest extends Request {
	user?: UserDocument
}

const protect = asyncHandler(
	async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		// Here we are checking if the token is present in the request header
		let token = req.cookies.jwt
		// Decode the token and get the user id from it and then find the user in the database and attach it to the request object
		if (token) {
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
					userId: string
				}

				const user = await User.findById(decoded.userId).select('-password')

				if (user) {
					req.user = user
					next()
				} else {
					res.status(401)
					throw new Error('Not authorized, user not found')
				}
			} catch (error) {
				res.status(401)
				throw new Error('Not authorized, token failed')
			}
		} else {
			res.status(401)
			throw new Error('Not authorized, no token')
		}
	}
)

export { protect }
