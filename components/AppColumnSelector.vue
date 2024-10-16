<template>
    <div class="my-auto w-full">
        <UFormGroup label="Columns" size="xs">
            <USelectMenu
                size="sm"
                v-model="selectedColumns"
                :options="columns"
                multiple
                placeholder="Columns"
            />
        </UFormGroup>
    </div>
</template>

<script lang="ts" setup>
    const columns: TableColumn[] = [
        {
            key: 'timestamp',
            label: 'Timestamp',
            sortable: true,
            icon: 'heroicons:clock-16-solid',
        },
        {
            key: 'command',
            label: 'Command',
            sortable: true,
            icon: 'heroicons:command-line-16-solid',
        },
        {
            key: 'user_name',
            label: 'User Name',
            sortable: true,
            icon: 'heroicons:user-16-solid',
        },
    ]

    const selectedColumns = useState<TableColumn[]>('selectedColumns', () => [])

    onMounted(() => {
        selectedColumns.value = [...columns]
    })
</script>
