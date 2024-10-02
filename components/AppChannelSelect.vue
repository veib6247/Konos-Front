<template>
    <div class="my-auto">
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
    type ChannelItem = {
        id: number
        created_at: string
        channel_id: string
        channel_name: string
    }

    type UIChannelItem = {
        id: string
        label: string
        icon?: string
    }

    type UIChannelItems = UIChannelItem[]

    const supabase = useSupabaseClient()
    const isLoading = ref(false)
    const channels = ref<UIChannelItems>([])
    const selected = ref()

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

    /**
     *
     */
    onMounted(async () => {
        await getData()
    })
</script>

<style></style>
