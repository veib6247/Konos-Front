<template>
    <div class="flex h-full w-full flex-col gap-4 overflow-auto p-6">
        <div class="flex gap-1">
            <UButton
                icon="i-heroicons-plus"
                size="xs"
                @click="openAddUserModal"
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
                            v-model="selectedUserType"
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
                        <UButton
                            :loading="isSaveButtonLoading"
                            size="xs"
                            @click="saveNewUser"
                        >
                            Save
                        </UButton>
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
    const selectedUserType = ref(userTypes[1])
    const channels = ref<TableChannelItem[]>([
        { channelName: '', channelId: '' },
    ])
    const isSaveButtonLoading = ref(false)

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
     *
     */
    function openAddUserModal() {
        // reset form first
        userEmail.value = ''
        selectedUserType.value = userTypes[1]
        channels.value = [{ channelName: '', channelId: '' }]

        //
        isAddUserModalOpen.value = true
    }

    /**
     * Save new user
     */
    async function saveNewUser() {
        isSaveButtonLoading.value = true

        if (userEmail.value === '') {
            alert('Email cannot be empty!')
            return
        }

        for (const channel of channels.value) {
            if (channel.channelName === '' || channel.channelId === '') {
                alert('Channel Name/ID cannot be empty!')
                return
            }
        }

        try {
            const res = await fetch('/api/inviteNewUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail.value,
                    type: selectedUserType.value,
                    channels: channels.value,
                }),
            })

            if (res.ok) {
                const data = await res.json()
                console.info(data)

                if (!data.isAddUserSuccess) {
                    alert(data.result.msg)
                } else {
                    isAddUserModalOpen.value = false
                }
            }
        } catch (error) {
            console.error(error)
        } finally {
            isSaveButtonLoading.value = false
        }
    }
</script>
