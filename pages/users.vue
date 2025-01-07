<template>
    <div class="flex h-full w-full flex-col gap-4 overflow-auto p-6">
        <UFormGroup
            size="xs"
            label="Users"
            description="Each users are allowed to only view their assigned channel(s)"
        >
            <UTable
                :columns="userColumns"
                :loading="isTableLoading"
                :rows="userRows"
            >
                <template #channels-data="{ row }">
                    <div class="flex gap-1">
                        <UBadge v-for="item in row.channels">
                            {{ item.channelName }}
                        </UBadge>
                    </div>
                </template>
            </UTable>
        </UFormGroup>
    </div>
</template>

<script lang="ts" setup>
    // composables
    useUpdateTitle('Users')

    // libs
    const supabase = useSupabaseClient()

    // states
    const isDevMode = import.meta.env.DEV
    const isTableLoading = ref(true)
    const userColumns = [
        { key: 'id', label: 'ID' },
        { key: 'email', label: 'Email' },
        { key: 'type', label: 'Type' },
        { key: 'channels', label: 'Channels' },
    ]
    const userRows = ref<UserRowItem[]>([])

    /**
     *
     */
    onMounted(async () => {
        await getUserList()
    })

    /**
     *
     */
    async function getUserList() {
        isTableLoading.value = true

        if (isDevMode) console.time('Fetch user list')

        try {
            const response = await fetch('/api/getUsersList')
            if (response.ok) {
                const data = await response.json()

                for (const user of data) {
                    const { data } = await supabase
                        .from('user_privileges')
                        .select('privileges')
                        .eq('user_id', user.id)

                    if (data) {
                        const userPrivileges: TableUserObject =
                            data[0].privileges

                        const rowItem: UserRowItem = {
                            id: user.id,
                            email: user.email,
                            type: userPrivileges.type,
                            channels: userPrivileges.channels,
                        }

                        userRows.value.push(rowItem)
                    }
                }
            }
        } catch (error) {
            console.error(error)
        }

        isTableLoading.value = false
        if (isDevMode) console.timeEnd('Fetch user list')
    }
</script>
