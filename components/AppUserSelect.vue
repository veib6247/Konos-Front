<template>
    <div class="my-auto w-full">
        <UFormGroup size="xs" label="User(s)">
            <USelectMenu
                searchable
                clear-search-on-close
                v-model="selectedUsers"
                :options="users"
                size="sm"
                multiple
            />
        </UFormGroup>
    </div>
</template>

<script lang="ts" setup>
    const users = useState<UIMenuItem[]>('availableUsers')
    const selectedUsers = useState<UIMenuItem[]>('selectedUser')
</script>

<style></style>
