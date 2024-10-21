// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		keepalive: true,
		pageTransition: { name: 'page', mode: 'out-in' },
	},
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
	modules: ['@nuxt/ui', '@nuxtjs/supabase'],
	build: {
		transpile: ['@vuepic/vue-datepicker'],
	},
	colorMode: {
		preference: 'dark',
	},
})
