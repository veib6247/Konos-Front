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
	const url = `${supabaseURL}/auth/v1/user`

	try {
		const updatePasswordResponse = await fetch(url, {
			method: 'PUT',
			headers: {
				apikey: supabaseKey,
				Authorization: `Bearer ${body.accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				password: body.password,
			}),
		})

		if (!updatePasswordResponse.ok) {
			const errorBody = await updatePasswordResponse.json()
			console.error(errorBody)

			return {
				isUpdatePasswordSuccess: false,
				result: errorBody,
			}
		}

		return {
			isUpdatePasswordSuccess: true,
			result: await updatePasswordResponse.json(),
		}
	} catch (error) {
		console.error(error)
	}
})
