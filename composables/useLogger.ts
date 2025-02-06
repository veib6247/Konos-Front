import pino from 'pino'

/**
 *
 * @returns pino logger instance
 */
export default function () {
	const logger = pino({
		level: import.meta.env.PROD ? 'error' : 'info', // Only log errors in production,
		transport: {
			target: 'pino-pretty', // Use pino-pretty for pretty-printing
			options: {
				colorize: true, // Add colors to the logs
				translateTime: 'SYS:yyyy-mm-dd HH:MM:ss', // Format timestamps
				ignore: 'pid,hostname', // Hide unnecessary fields
			},
		},
	})

	return logger
}
