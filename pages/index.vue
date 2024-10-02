<template>
    <div class="h-full w-full overflow-auto">
        <!-- table action -->
        <div
            class="sticky top-0 z-40 flex h-20 w-full flex-row gap-2 border-b border-b-green-300/30 backdrop-blur-lg"
        >
            <div class="flex w-1/2 flex-row gap-2 px-4">
                <AppChannelSelect />
                <AppUserSelect />
            </div>
            <div class="flex w-1/2 flex-row-reverse px-4">
                <div class="my-auto">
                    <UButton
                        :loading="isLoading"
                        size="xs"
                        icon="heroicons:arrow-path-16-solid"
                        @click="getData()"
                    />
                </div>
            </div>
        </div>

        <!-- table -->
        <div class="h-full min-h-full w-full">
            <UTable
                :loading="isLoading"
                :sort="sort"
                :columns="columns"
                :rows="rows"
                :empty-state="{
                    icon: 'i-heroicons-circle-stack-20-solid',
                    label: 'No items.',
                }"
            >
                <template #expand="{ row }">
                    <div class="p-4 text-xs">
                        <pre>{{ row }}</pre>
                    </div>
                </template>
            </UTable>
        </div>
    </div>
</template>

<script lang="ts" setup>
    useUpdateTitle('Home')

    const isLoading = ref(false)
    const supabase = useSupabaseClient()
    const rows = ref()
    const sort = ref({
        column: 'id',
        direction: 'desc' as const,
    })
    const columns = [
        {
            key: 'id',
            label: '#',
            sortable: true,
        },
        {
            key: 'x-slack-request-timestamp',
            label: 'Raw Stamp',
            sortable: true,
        },
        {
            key: 'timestamp',
            label: 'Timestamp',
            sortable: true,
        },
        {
            key: 'command',
            label: 'Command',
            sortable: true,
        },
        {
            key: 'user_name',
            label: 'User Name',
            sortable: true,
        },
        {
            key: 'text',
            label: 'User Notes',
            sortable: true,
        },
    ]

    const selectedChannel = useState<UIMenuItem>('selectedChannel')
    const selectedUsers = useState<UIMenuItem[]>('selectedUser')

    /**
     * reload data whenever the selected channel changes
     */
    watch(selectedChannel, async () => {
        await getData()
    })

    watch(selectedUsers, async () => {
        await getData()
    })

    /**
     * loads data into table
     */
    const getData = async () => {
        isLoading.value = true

        try {
            let query = supabase
                .from('Slack Timestamp')
                .select('*')
                .eq('channel_id', selectedChannel.value.id)

            if (selectedUsers.value.length > 0) {
                const users = []
                for (const user of selectedUsers.value) {
                    users.push(user.label)
                }

                query = supabase
                    .from('Slack Timestamp')
                    .select('*')
                    .eq('channel_id', selectedChannel.value.id)
                    .in('user_name', users)
            }

            const { data } = await query
            rows.value = data
        } catch (error) {
            console.error(error)
            rows.value = []
        } finally {
            isLoading.value = false
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
