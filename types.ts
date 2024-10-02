export type ChannelItem = {
	id: number
	created_at: string
	channel_id: string
	channel_name: string
}

export type UIChannelItem = {
	id: string
	label: string
	icon?: string
}

export type UIChannelItems = UIChannelItem[]
