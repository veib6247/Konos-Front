const supabaseURL = process.env.SUPABASE_URL
if (!supabaseURL) {
	throw new Error('SUPABASE_URL not configured!')
}

const supabaseKey = process.env.SUPABASE_KEY
if (!supabaseKey) {
	throw new Error('SUPABASE_KEY not configured!')
}

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseServiceRoleKey) {
	throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured!')
}

/**
 *
 */
export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const url = `${supabaseURL}/auth/v1/invite`

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			apikey: supabaseKey,
			Authorization: `Bearer ${supabaseServiceRoleKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email: body.email,
			data: {
				username: 'fukazer0',
				role: body.type,
				channels: body.channels,
			},
		}),
	})

	if (!response.ok) {
		const errorBody = await response.json()
		console.error(errorBody)

		return {
			isAddUserSuccess: false,
			result: errorBody,
		}
	}

	const data = await response.json()
	return {
		isAddUserSuccess: true,
		result: data,
	}
})
