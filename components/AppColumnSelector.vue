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
            key: 'id',
            label: 'ID',
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

    const selectedColumns = useState<TableColumn[]>('selectedColumns', () => [])

    onMounted(() => {
        selectedColumns.value = [...columns]
    })
</script>
