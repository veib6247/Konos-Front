<template>
    <div class="flex h-16 flex-row border-b border-b-green-300/30">
        <!-- left -->
        <div class="flex w-1/2 px-6">
            <div class="my-auto flex flex-col gap-0">
                <h1 class="text-primary text-lg font-semibold">Kronos</h1>
                <p class="text-xs font-light">Timestamp tracking in Slack</p>
            </div>
        </div>

        <!-- right -->
        <div class="flex w-1/2 flex-row-reverse px-6">
            <div class="my-auto flex flex-col">
                <p class="text-xs">Logout</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    useHead({
        title: 'Kronos | Home',
    })
</script>

<style></style>
