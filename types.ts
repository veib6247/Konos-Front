export type ChannelItem = {
	id: number
	created_at: string
	channel_id: string
	channel_name: string
}

export type UserItem = {
	user_id: string
	user_name: string
}

export type UIMenuItem = {
	id: string
	label: string
	icon?: string
}

export type UIMenuItems = UIMenuItem[]
