<template>
    <div class="flex h-full w-full flex-col gap-4 overflow-auto p-6">
        <div class="flex gap-1">
            <UButton
                icon="i-heroicons-plus"
                size="xs"
                @click="isAddUserModalOpen = true"
            >
                Add New User
            </UButton>
        </div>

        <UFormGroup>
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

        <UModal v-model="isAddUserModalOpen">
            <UCard class="overflow-auto">
                <template #header> Add New User </template>

                <div class="flex flex-col gap-6">
                    <UFormGroup size="sm" label="Email" required>
                        <UInput
                            placeholder="you@payreto.com"
                            icon="i-heroicons-envelope"
                            v-model="userEmail"
                        />
                    </UFormGroup>

                    <UFormGroup size="sm" label="Type">
                        <USelect
                            v-model="defaultUserType"
                            :options="userTypes"
                        />
                    </UFormGroup>

                    <UFormGroup size="sm" label="Channels">
                        <div class="flex flex-col gap-4 p-4">
                            <div
                                class="flex flex-row gap-1"
                                v-for="(channel, index) in channels"
                            >
                                <UFormGroup
                                    class="w-full"
                                    size="xs"
                                    label="Name"
                                >
                                    <UInput
                                        placeholder="td-attendance"
                                        v-model="channel.channelName"
                                    />
                                </UFormGroup>

                                <UFormGroup class="w-full" size="xs" label="ID">
                                    <UInput
                                        placeholder="C069FH66QJ3"
                                        v-model="channel.channelId"
                                    />
                                </UFormGroup>

                                <div class="flex flex-col-reverse">
                                    <UButton
                                        square
                                        size="xs"
                                        icon="i-heroicons-minus"
                                        @click="channels.splice(index, 1)"
                                        v-if="channels.length > 1"
                                    />
                                </div>

                                <div class="flex flex-col-reverse">
                                    <UButton
                                        square
                                        size="xs"
                                        icon="i-heroicons-plus"
                                        @click="
                                            channels.push({
                                                channelName: '',
                                                channelId: '',
                                            })
                                        "
                                    />
                                </div>
                            </div>
                        </div>
                    </UFormGroup>
                </div>

                <template #footer>
                    <div class="flex flex-row-reverse">
                        <UButton size="xs" @click="saveNewUser"> Save </UButton>
                    </div>
                </template>
            </UCard>
        </UModal>
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
    const isAddUserModalOpen = ref(false)
    const userColumns = [
        { key: 'id', label: 'ID' },
        { key: 'email', label: 'Email' },
        { key: 'type', label: 'Type' },
        { key: 'channels', label: 'Channels' },
    ]
    const userRows = ref<UserRowItem[]>([])
    const userEmail = ref('')
    const userTypes = ['admin', 'basic']
    const defaultUserType = ref(userTypes[1])
    const channels = ref<TableChannelItem[]>([
        { channelName: '', channelId: '' },
    ])

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

    /**
     * Save new user
     */
    function saveNewUser() {
        if (
            channels.value[0].channelName === '' ||
            channels.value[0].channelId === ''
        ) {
            alert('Please fill in the channel name and channel ID')
            return
        }

        console.info('works!')
        isAddUserModalOpen.value = false
    }
</script>
