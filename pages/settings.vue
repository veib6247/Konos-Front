<template>
    <div class="flex h-full w-full flex-col gap-4 overflow-auto p-6">
        <UFormGroup
            size="xs"
            label="Show expand option to display row JSON data"
        >
            <UToggle size="xs" v-model="showRawRowData" />
        </UFormGroup>
    </div>
</template>

<script lang="ts" setup>
    useUpdateTitle('Settings')

    // states
    const showRawRowData = useState<boolean>('showRawRowData')
</script>
