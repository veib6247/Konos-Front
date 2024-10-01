<template>
    <div class="h-full w-full">
        <UTable
            :loading="isLoading"
            :columns="columns"
            :rows="rows"
            v-if="rows"
        >
            <template #expand="{ row }">
                <div class="p-4 text-xs">
                    <pre>{{ row }}</pre>
                </div>
            </template>
        </UTable>
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
            label: 'Slack Timestamp',
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

    const page = ref(1)
    const pageCount = 5

    const pRows = computed(() => {
        return rows.value.slice(
            (page.value - 1) * pageCount,
            page.value * pageCount
        )
    })

    /**
     *
     */
    onMounted(async () => {
        isLoading.value = true
        const { data } = await supabase.from('Slack Timestamp').select('*')
        rows.value = data
        isLoading.value = false
    })
</script>

<style></style>
