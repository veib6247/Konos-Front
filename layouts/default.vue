<template>
    <div class="flex h-dvh min-h-dvh w-full flex-col overflow-hidden">
        <!-- top -->
        <header class="w-full">
            <AppTopNav />
        </header>

        <!-- bottom -->
        <main class="flex h-full flex-row">
            <aside
                class="w-64 min-w-64 flex-col border-r border-r-green-300/30 px-4 py-4"
            >
                <div class="flex flex-col gap-1">
                    <h1 class="text-xs font-semibold uppercase text-white/40">
                        Menu
                    </h1>
                    <UVerticalNavigation :links="links" />
                </div>
            </aside>

            <!-- page slot -->
            <div class="customHeight flex w-full flex-col">
                <slot />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
    const links = [
        {
            label: 'Time Logs',
            icon: 'heroicons:queue-list-16-solid',
            to: '/',
        },
        {
            label: 'Setting',
            icon: 'heroicons:cog-6-tooth-16-solid',
            to: '/settings',
        },
    ]
</script>

<style>
    .customHeight {
        height: calc(100dvh - 64px);
    }
</style>
