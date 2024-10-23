<template>
    <div class="h-full w-full">
        <!-- table action -->
        <div
            class="sticky top-0 z-40 flex h-20 w-full flex-row gap-2 border-b border-b-green-300/30 backdrop-blur-lg"
        >
            <div class="flex w-full flex-row gap-2 px-4">
                <AppColumnSelector />
                <AppChannelSelect />
                <AppUserSelect />
                <AppDatePicker />
                <div class="my-auto">
                    <UFormGroup label="Actions" size="xs">
                        <div class="flex flex-row gap-2">
                            <UButton
                                size="sm"
                                label="Export"
                                icon="heroicons:table-cells-16-solid"
                                @click="exportData()"
                            />
                            <UButton
                                :loading="isLoading"
                                label="Reload"
                                size="sm"
                                icon="heroicons:arrow-path-16-solid"
                                @click="getData()"
                            />
                        </div>
                    </UFormGroup>
                </div>
            </div>
        </div>

        <!-- table -->
        <div class="tableHeight w-full overflow-auto">
            <UTable
                :loading="isLoading"
                :sort="sort"
                :columns="selectedColumns"
                :rows="rows"
                :empty-state="emptyState"
                :ui="ui"
            >
                <!-- dropdown for raw data -->
                <template #expand="{ row }" v-if="showRawRowData">
                    <div class="p-4 text-xs">
                        <pre>{{ row }}</pre>
                    </div>
                </template>

                <!-- User notes data -->
                <template #text-data="{ row }">
                    <UTooltip :text="row.text">
                        <div class="w-48 truncate italic">
                            {{ row.text }}
                        </div>
                    </UTooltip>
                </template>
            </UTable>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { mkConfig, generateCsv, download } from 'export-to-csv'

    useUpdateTitle('Home')

    // init date picker with the date today
    const dateRange = useState<DateRange>('dateRange')
    const showRawRowData = useState<boolean>('showRawRowData')
    const supabase = useSupabaseClient()

    /**
     * UTable props
     */
    const ui = {
        tr: {
            base: 'hover:bg-gray-50/5 transition',
        },
    }
    const isLoading = ref(false)
    const rows = ref()
    const sort = ref({
        column: 'id',
        direction: 'desc' as const,
    })
    const emptyState = ref({
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'No items.',
    })

    const selectedColumns = useState<TableColumn[]>('selectedColumns')
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

    watch(dateRange, async () => {
        await getData()
    })

    /**
     * loads data into table
     */
    const getData = async () => {
        if (import.meta.env.DEV) console.group('Get table data')

        const tableName = 'Slack Timestamp'
        isLoading.value = true

        // todo: PREFETCH INIT DATA ON APP LEVEL
        try {
            if (import.meta.env.DEV) console.time('Fetched table contents')
            let query = supabase
                .from(tableName)
                .select('*')
                .eq('channel_id', selectedChannel.value.id)
                .gte(
                    'timestamp',
                    `${getFormattedDate(dateRange.value[0])} 00:00:00`
                )
                .lte(
                    'timestamp',
                    `${getFormattedDate(dateRange.value[1])} 23:59:59`
                )
            if (import.meta.env.DEV) console.timeEnd('Fetched table contents')

            if (selectedUsers.value.length > 0) {
                if (import.meta.env.DEV)
                    console.time('Fetched table contents - specific user(s)')

                const users = []
                for (const user of selectedUsers.value) {
                    users.push(user.label)
                }

                query = supabase
                    .from(tableName)
                    .select('*')
                    .eq('channel_id', selectedChannel.value.id)
                    .in('user_name', users)
                    .gte(
                        'timestamp',
                        `${getFormattedDate(dateRange.value[0])} 00:00:00`
                    )
                    .lte(
                        'timestamp',
                        `${getFormattedDate(dateRange.value[1])} 23:59:59`
                    )

                if (import.meta.env.DEV)
                    console.timeEnd('Fetched table contents - specific user(s)')
            }

            const { data, error } = await query
            if (error) console.error(error)
            rows.value = data
        } catch (error) {
            console.error(error)
            rows.value = []
        } finally {
            isLoading.value = false
        }

        if (import.meta.env.DEV) console.groupEnd()
    }

    /**
     *
     */
    const exportData = () => {
        if (import.meta.env.DEV) console.group('Processing table data to csv')

        // init config for export button
        // mkConfig merges your options with the defaults
        // and returns WithDefaults<ConfigOptions>

        const csvConfig = mkConfig({ useKeysAsHeaders: true })
        if (rows.value === undefined) {
            if (import.meta.env.DEV) console.time('CVS Conversion')

            const csv = generateCsv(csvConfig)(rows.value)
            download(csvConfig)(csv)

            if (import.meta.env.DEV) console.timeEnd('CVS Conversion')
        } else {
            alert('No data to convert to CSV!')
        }

        if (import.meta.env.DEV) console.groupEnd()
    }

    await getData()
</script>

<style>
    .tableHeight {
        height: calc(100dvh - 144px);
    }
</style>
