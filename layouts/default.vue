<template>
    <div class="flex h-dvh w-full flex-col overflow-hidden">
        <!-- top -->
        <AppTopNav />

        <!-- bottom -->
        <div class="flex h-full w-full">
            <!-- left -->
            <div
                class="sticky flex h-full w-64 flex-col border-r border-r-green-300/30 px-6 py-4"
            >
                <UVerticalNavigation :links="links" />
            </div>

            <!-- right -->
            <div class="h-full w-full overflow-hidden">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const links = [
        {
            label: 'Home',
            icon: 'heroicons:home-16-solid',
            to: '/',
        },
        {
            label: 'Setting',
            icon: 'heroicons:cog-6-tooth-16-solid',
            to: '/settings',
        },
    ]
</script>
