export default function (pageTitle: string) {
	const appName = useState<string>('appName')
	useHead({
		title: `${appName.value} | ${pageTitle}`,
	})
}
