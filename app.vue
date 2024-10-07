<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
    /**
     * init states
     */
    useState('appName', () => 'Kronos')
    useState('showRawRowData', () => true)
    const supabase = useSupabaseClient()

    /**
     * fetching valid channels
     */
    const channels = useState<UIMenuItems>('availableChannels', () => {
        return []
    })

    const selectedChannel = useState('selectedChannel', () => {
        return ref<UIMenuItem>()
    })

    await getValidChannels()

    async function getValidChannels() {
        channels.value = [] // clear old data

        try {
            const { data } = await supabase.from('Valid Channels').select('*')
            if (data) {
                for (const channel of data) {
                    const item = channel as ChannelItem
                    channels.value.push({
                        id: item.channel_id,
                        label: item.channel_name,
                        icon: 'heroicons:chat-bubble-left-right-16-solid',
                    })
                }
            }
        } catch (error) {
            console.error(error)
            channels.value = []
        } finally {
            selectedChannel.value = channels.value[0]
        }
    }

    /**
     * fetching available users
     */
    const users = useState<UIMenuItems>('availableUsers', () => {
        return []
    })

    useState('selectedUser', () => {
        return ref<UIMenuItem[]>([])
    })

    await getAvailableUsers()

    async function getAvailableUsers() {
        users.value = []

        try {
            const { data } = await supabase.from('App Users').select('*')
            if (data) {
                for (const channel of data) {
                    const item = channel as UserItem
                    users.value.push({
                        id: item.user_id,
                        label: item.user_name,
                        icon: 'heroicons:user-circle-16-solid',
                    })
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
</script>

<style>
    .page-enter-active,
    .page-leave-active {
        transition: all 0.2s;
    }
    .page-enter-from,
    .page-leave-to {
        opacity: 0;
        filter: blur(1rem);
    }
</style>
