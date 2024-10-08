<template>
    <div class="my-auto w-full">
        <UFormGroup size="xs" label="Channel Name">
            <USelectMenu
                searchable
                clear-search-on-close
                v-model="selected"
                :options="channels"
                size="sm"
            />
        </UFormGroup>
    </div>
</template>

<script lang="ts" setup>
    // const supabase = useSupabaseClient()
    const channels = useState<UIMenuItems>('availableChannels')
    const selected = useState<UIMenuItem>('selectedChannel')
</script>

<style></style>
