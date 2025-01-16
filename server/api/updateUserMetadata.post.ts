const supabaseURL = process.env.SUPABASE_URL
if (!supabaseURL) {
	throw new Error('SUPABASE_URL not configured!')
}

const supabaseKey = process.env.SUPABASE_KEY
if (!supabaseKey) {
	throw new Error('SUPABASE_KEY not configured!')
}

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_KEY
if (!supabaseServiceRoleKey) {
	throw new Error('SUPABASE_SERVICE_KEY not configured!')
}

/**
 *
 */
export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const userId = body.userId
	const metadata = body.metadata

	const url = `${supabaseURL}/auth/v1/admin/users/${userId}`

	try {
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				apikey: supabaseKey,
				Authorization: `Bearer ${supabaseServiceRoleKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				user_metadata: metadata,
			}),
		})

		if (response.status === 200) {
			return {
				status: response.status,
				body: 'User metadata updated',
			}
		}

		return {
			status: response.status,
			body: await response.text(),
		}
	} catch (error) {
		console.error('Failed http request to Supabase', error)
	}
})
