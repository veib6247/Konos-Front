<template>
    <div class="my-auto w-full">
        <UFormGroup size="xs" label="Channel Name">
            <USelectMenu
                searchable
                clear-search-on-close
                v-model="selected"
                :options="channels"
                size="xs"
            />
        </UFormGroup>
    </div>
</template>

<script lang="ts" setup>
    const supabase = useSupabaseClient()
    const channels = ref<UIMenuItems>([])
    const selected = useState('selectedChannel', () => {
        return ref<UIMenuItem>()
    })

    /**
     * loads data into table
     */
    const getData = async () => {
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
            selected.value = channels.value[0]
        }
    }

    await getData()
</script>

<style></style>
