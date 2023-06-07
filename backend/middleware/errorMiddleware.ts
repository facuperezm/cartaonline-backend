import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'

const notFound = (req: Request, res: Response, next: NextFunction): void => {
	const error = new Error(`Not Found - ${req.originalUrl}`)
	res.status(404)
	next(error)
}

const errorHandler: ErrorRequestHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let statusCode = res.statusCode === 200 ? 500 : res.statusCode
	let message = err.message

	// If Mongoose not found error, set to 404 and change message
	if (err.name === 'CastError') {
		statusCode = 404
		message = 'Resource not found'
	}

	res.status(statusCode).json({
		message: message,
		stack: process.env.NODE_ENV === 'production' ? null : err.stack
	})
}

export { notFound, errorHandler }
