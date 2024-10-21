<template>
    <div class="flex h-full w-full flex-col gap-4 overflow-auto p-6">
        <UFormGroup
            size="xs"
            label="Show expand option to display row JSON data"
        >
            <UToggle size="xs" v-model="showRawRowData" />
        </UFormGroup>

        <UFormGroup
            size="xs"
            label="Valid Channels"
            class="w-1/2"
            description="The following are channels are where the Kronos app has been added to Slack"
        >
            <UTable :columns="columns" :loading="isTableLoading" :rows="rows">
                <template #actions-data="{ row }">
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="heroicons:trash"
                        @click="deleteSelectedRow(row)"
                    />
                </template>
            </UTable>

            <div>
                <UButton
                    label="Add new channel"
                    icon="heroicons:chat-bubble-left-right-16-solid"
                    @click="showModal = true"
                />
            </div>
        </UFormGroup>

        <UModal v-model="showModal">
            <div class="flex flex-col gap-2 p-6">
                <h1 class="text-xl font-semibold">Add Channel</h1>
                <div class="flex flex-col gap-2">
                    <UFormGroup size="xs" label="ID">
                        <UInput placeholder="C06AKRJXXXX" v-model="channelId" />
                    </UFormGroup>

                    <UFormGroup size="xs" label="Name">
                        <UInput
                            placeholder="xx-xxxxxxxx"
                            v-model="channelName"
                        />
                    </UFormGroup>

                    <div class="flex flex-row-reverse">
                        <UButton
                            label="Save"
                            icon="heroicons:check"
                            :loading="isSaveButtonLoading"
                            @click="saveChannel"
                        />
                    </div>
                </div>
            </div>
        </UModal>
    </div>
</template>

<script lang="ts" setup>
    // composables
    useUpdateTitle('Settings')

    // states
    const showRawRowData = useState<boolean>('showRawRowData')
    const supabase = useSupabaseClient()
    const isTableLoading = ref(true)
    const isSaveButtonLoading = ref(false)
    const tableName = 'Valid Channels'
    const showModal = ref(false)
    const channelId = ref('')
    const channelName = ref('')

    const columns = [
        {
            key: 'channel_id',
            label: 'ID',
        },
        {
            key: 'channel_name',
            label: 'Name',
        },
        {
            key: 'actions',
        },
    ]

    const rows = ref([])

    onMounted(async () => {
        await loadData()
    })

    async function loadData() {
        isTableLoading.value = true
        rows.value = []

        const query = supabase.from(tableName).select('*')
        const { data, error } = await query

        if (error) {
            console.error(error)
        }

        if (data) {
            for (const item of data) {
                rows.value.push(item)
            }
        }

        isTableLoading.value = false
    }

    async function deleteSelectedRow(row: ChannelItem) {
        const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('channel_id', row.channel_id)

        if (error) {
            console.error(error)
        }

        await loadData()
    }

    async function saveChannel() {
        isSaveButtonLoading.value = true

        const query = supabase.from('Valid Channels').insert([
            {
                channel_id: channelId.value,
                channel_name: channelName.value,
            },
        ] as never) // FIX THISSSSSS!!!

        const { data, error } = await query

        if (error) {
            console.error(error)
        }

        if (data) {
            console.info(data)
        }

        channelId.value = ''
        channelName.value = ''
        showModal.value = false

        isSaveButtonLoading.value = false
        await loadData()
    }
</script>
