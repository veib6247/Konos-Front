<template>
    <div class="flex h-16 min-h-16 flex-row border-b border-b-green-300/30">
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
                <div class="flex flex-row gap-2" v-if="user?.email">
                    <p class="my-auto text-xs">{{ user?.email }}</p>
                    <UButton label="Logout" size="xs" @click="logout" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    /**
     * go home
     */
    async function logout() {
        supabase.auth.signOut()
        await navigateTo('/login')
    }
</script>

<style></style>
