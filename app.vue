<template>
    <div class="flex h-dvh w-full flex-col">
        <!-- top -->
        <AppTopNav />

        <!-- bottom -->
        <div class="flex h-full w-full">
            <!-- left -->
            <div
                class="flex h-full w-64 flex-col border-r border-r-green-300/30 px-6 py-4"
            >
                <UVerticalNavigation :links="links" />
            </div>

            <!-- right -->
            <div class="h-full w-full">
                <NuxtPage />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    useHead({
        title: 'Kronos',
    })

    const links = [
        {
            label: 'Home',
            icon: 'i-heroicons-home',
            to: '/',
        },
    ]
</script>
