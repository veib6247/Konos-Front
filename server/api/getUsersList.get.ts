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

export default defineEventHandler(async () => {
	const url = `${supabaseURL}/auth/v1/admin/users`

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			apikey: supabaseKey,
			Authorization: `Bearer ${supabaseServiceRoleKey}`,
			'Content-Type': 'application/json',
		},
	})

	if (!response.ok) {
		const errorBody = await response.text()
		throw new Error(
			`HTTP error! status: ${response.status}, body: ${errorBody}`,
		)
	}

	const { users } = await response.json()
	return users
})
