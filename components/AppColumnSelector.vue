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
    const columns = [
        {
            key: 'timestamp',
            label: 'Timestamp',
            sortable: true,
            icon: 'heroicons:view-columns-16-solid',
        },
        {
            key: 'command',
            label: 'Command',
            sortable: true,
            icon: 'heroicons:view-columns-16-solid',
        },
        {
            key: 'user_name',
            label: 'User Name',
            sortable: true,
            icon: 'heroicons:view-columns-16-solid',
        },
        {
            key: 'text',
            label: 'User Notes',
            sortable: true,
            icon: 'heroicons:view-columns-16-solid',
        },
    ]

    const selectedColumns = useState<TableColumn[]>('selectedColumns', () => [])

    onMounted(() => {
        selectedColumns.value = [...columns]
    })
</script>
