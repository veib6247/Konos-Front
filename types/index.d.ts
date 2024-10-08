declare global {
	type ChannelItem = {
		id: number
		created_at: string
		channel_id: string
		channel_name: string
	}

	type UserItem = {
		user_id: string
		user_name: string
	}

	type UIMenuItem = {
		id: string
		label: string
		icon?: string
	}

	type UIMenuItems = UIMenuItem[]

	type DateRange = [Date, Date]

	type TableColumn = {
		key: string
		label: string
		sortable: boolean
	}
}

export {}
