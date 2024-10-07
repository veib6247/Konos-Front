<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
    /**
     * init states
     */
    useState('appName', () => 'Kronos')
    useState('showRawRowData', () => true)
</script>

<style>
    .page-enter-active,
    .page-leave-active {
        transition: all 0.2s;
    }
    .page-enter-from,
    .page-leave-to {
        opacity: 0;
        filter: blur(1rem);
    }
</style>
