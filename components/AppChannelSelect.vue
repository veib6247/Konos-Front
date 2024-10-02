<template>
    <div class="my-auto w-full">
        <UFormGroup size="xs" label="Channel">
            <USelectMenu
                v-model="selected"
                :options="channels"
                size="xs"
                :loading="isLoading"
            />
        </UFormGroup>
    </div>
</template>

<script lang="ts" setup>
    import type { ChannelItem, UIChannelItem, UIChannelItems } from '~/types'

    const supabase = useSupabaseClient()
    const isLoading = ref(false)
    const channels = ref<UIChannelItems>([])
    const selected = useState('selectedChannel', () => {
        return ref<UIChannelItem>()
    })

    /**
     * loads data into table
     */
    const getData = async () => {
        isLoading.value = true

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
            isLoading.value = false
            selected.value = channels.value[0]
        }
    }

    await getData()
</script>

<style></style>
