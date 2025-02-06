import pino from 'pino'

/**
 *
 * @returns pino logger instance
 */
export default function () {
	const logger = pino({
		level: import.meta.env.PROD ? 'error' : 'info', // Only log errors in production
	})

	return logger
}
