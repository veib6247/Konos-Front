<template>
    <div class="h-full w-full">
        <!-- table action -->
        <div class="flex flex-row gap-2 p-6">
            <UButton
                :loading="isLoading"
                size="xs"
                icon="heroicons:arrow-path-16-solid"
                @click="getData()"
            />
        </div>

        <!-- table -->
        <div class="h-full overflow-auto">
            <UTable
                :loading="isLoading"
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
    const columns = [
        {
            key: 'id',
            label: 'ID',
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
            key: 'channel_id',
            label: 'Channel ID',
            sortable: true,
        },
        {
            key: 'channel_name',
            label: 'Channel Name',
            sortable: true,
        },
        {
            key: 'user_name',
            label: 'User Name',
            sortable: true,
        },
        {
            key: 'user_id',
            label: 'User ID',
            sortable: true,
        },
        {
            key: 'command',
            label: 'Command',
            sortable: true,
        },
        {
            key: 'text',
            label: 'User Notes',
            sortable: true,
        },
        {
            key: 'created_at',
            label: 'Created At',
            sortable: true,
        },
    ]

    /**
     * loads data into table
     */
    const getData = async () => {
        isLoading.value = true

        try {
            const { data } = await supabase.from('Slack Timestamp').select('*')
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
