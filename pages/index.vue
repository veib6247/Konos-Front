<template>
    <div class="h-full w-full overflow-auto">
        <!-- table action -->
        <div
            class="sticky top-0 z-40 flex h-20 w-full flex-row gap-2 border-b border-b-green-300/30 backdrop-blur-lg"
        >
            <div
                class="flex w-full flex-row gap-2 border-r border-r-green-300/30 px-4"
            >
                <AppChannelSelect />
                <AppUserSelect />
                <UFormGroup class="my-auto w-full" size="xs" label="Date Range">
                    <VueDatePicker
                        :dark="true"
                        v-model="dateRange"
                        :format="format"
                        range
                    ></VueDatePicker>
                </UFormGroup>
            </div>
            <div class="flex flex-row-reverse gap-3 px-4">
                <div class="my-auto">
                    <UButton
                        :loading="isLoading"
                        size="xs"
                        icon="heroicons:arrow-path-16-solid"
                        @click="getData()"
                    />
                </div>

                <div class="my-auto">
                    <UButton
                        size="xs"
                        icon="heroicons:table-cells-16-solid"
                        @click="exportData()"
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
                <template #expand="{ row }" v-if="showRawRowData">
                    <div class="p-4 text-xs">
                        <pre>{{ row }}</pre>
                    </div>
                </template>

                <template #text-data="{ row }">
                    <div class="w-56">
                        <UTooltip :text="row.text">
                            <p class="w-56 truncate">{{ row.text }}</p>
                        </UTooltip>
                    </div>
                </template>
            </UTable>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import VueDatePicker from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'
    import { mkConfig, generateCsv, download } from 'export-to-csv'

    useUpdateTitle('Home')

    // init date picker with the date today
    const dateRange = ref<DateRange>([new Date(), new Date()])

    /**
     * date picker UI format
     */
    const format = (dateRange: DateRange) => {
        if (dateRange[1])
            return `from ${getFormattedDate(dateRange[0])} - to ${getFormattedDate(dateRange[1])}`

        return getFormattedDate(dateRange[0])
    }

    const showRawRowData = useState('showRawRowData')
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

    watch(dateRange, async () => {
        await getData()
    })

    /**
     * loads data into table
     */
    const getData = async () => {
        const tableName = 'Slack Timestamp'
        isLoading.value = true

        // todo: PREFETCH INIT DATA ON APP LEVEL
        try {
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

            if (selectedUsers.value.length > 0) {
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
    }

    /**
     *
     */
    const exportData = () => {
        // init config for export button
        // mkConfig merges your options with the defaults
        // and returns WithDefaults<ConfigOptions>
        const csvConfig = mkConfig({ useKeysAsHeaders: true })
        const csv = generateCsv(csvConfig)(rows.value)
        download(csvConfig)(csv)
    }

    /**
     *
     */
    // onMounted(async () => {
    //     await getData()
    // })

    await getData()
</script>

<style>
    .dp__theme_dark {
        --dp-font-size: 13px;
        --dp-border-radius: 0.375rem;
        --dp-cell-border-radius: 0.375rem;
        --dp-background-color: #111827;
        --dp-text-color: #fff;
        --dp-hover-color: #484848;
        --dp-hover-text-color: #fff;
        --dp-hover-icon-color: #959595;
        --dp-primary-color: #4ade80;
        --dp-primary-disabled-color: #61a8ea;
        --dp-primary-text-color: #fff;
        --dp-secondary-color: #a9a9a9;
        --dp-border-color: rgb(55 65 81);
        --dp-menu-border-color: rgb(55 65 81);
        --dp-border-color-hover: rgb(55 65 81);
        --dp-border-color-focus: rgb(55 65 81);
        --dp-disabled-color: #737373;
        --dp-disabled-color-text: #d0d0d0;
        --dp-scroll-bar-background: #212121;
        --dp-scroll-bar-color: #484848;
        --dp-success-color: #00701a;
        --dp-success-color-disabled: #428f59;
        --dp-icon-color: #959595;
        --dp-danger-color: #e53935;
        --dp-marker-color: #e53935;
        --dp-tooltip-color: #3e3e3e;
        --dp-highlight-color: #4ade80;
        --dp-range-between-dates-background-color: var(
            --dp-hover-color,
            #484848
        );
        --dp-range-between-dates-text-color: var(--dp-hover-text-color, #fff);
        --dp-range-between-border-color: var(--dp-hover-color, #fff);
    }
</style>
