<template>
    <div class="h-full w-full overflow-auto">
        <!-- table action -->
        <div
            class="sticky top-0 z-40 flex h-20 w-full flex-row gap-2 border-b border-b-green-300/30 backdrop-blur-lg"
        >
            <div class="flex w-full flex-row gap-2 px-4">
                <AppChannelSelect />
                <AppUserSelect />
                <UFormGroup class="my-auto w-full" size="xs" label="Date">
                    <VueDatePicker
                        class="dp__theme_dark"
                        v-model="dateRange"
                        :format="format"
                        range
                    ></VueDatePicker>
                </UFormGroup>
            </div>
            <div class="flex flex-row-reverse px-4">
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
                <template #expand="{ row }" v-if="showRawRowData">
                    <div class="p-4 text-xs">
                        <pre>{{ row }}</pre>
                    </div>
                </template>
            </UTable>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import VueDatePicker from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'

    useUpdateTitle('Home')

    // init date picker with the date today
    const dateRange = ref<DateRange>([new Date(), new Date()])

    /**
     * date picker UI format
     */
    const format = (dateRange: DateRange) => {
        const dayFrom = dateRange[0].getDate()
        const monthFrom = dateRange[0].getMonth()
        const yearFrom = dateRange[0].getFullYear()

        if (dateRange[1]) {
            const dayTo = dateRange[1].getDate()
            const monthTo = dateRange[1].getMonth()
            const yearTo = dateRange[1].getFullYear()

            return `From: ${yearFrom}-${leftZeroPad(monthFrom)}-${leftZeroPad(dayFrom)} -> To: ${yearTo}-${leftZeroPad(monthTo)}-${leftZeroPad(dayTo)}`
        }

        return `${yearFrom}-${leftZeroPad(monthFrom)}-${leftZeroPad(dayFrom)}`
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
                .gte('timestamp', '2024-09-30 00:00:00')
                .lte('timestamp', '2024-09-30 23:59:59')

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
                    .gte('timestamp', '2024-09-30 00:00:00')
                    .lte('timestamp', '2024-09-30 23:59:59')
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
    onMounted(async () => {
        await getData()
    })
</script>

<style>
    .dp__theme_dark {
        --dp-background-color: #212121;
        --dp-text-color: #fff;
        --dp-hover-color: #484848;
        --dp-hover-text-color: #fff;
        --dp-hover-icon-color: #959595;
        --dp-primary-color: #005cb2;
        --dp-primary-disabled-color: #61a8ea;
        --dp-primary-text-color: #fff;
        --dp-secondary-color: #a9a9a9;
        --dp-border-color: #2d2d2d;
        --dp-menu-border-color: #2d2d2d;
        --dp-border-color-hover: #aaaeb7;
        --dp-border-color-focus: #aaaeb7;
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
        --dp-highlight-color: rgb(0 92 178 / 20%);
        --dp-range-between-dates-background-color: var(
            --dp-hover-color,
            #484848
        );
        --dp-range-between-dates-text-color: var(--dp-hover-text-color, #fff);
        --dp-range-between-border-color: var(--dp-hover-color, #fff);
    }
</style>
