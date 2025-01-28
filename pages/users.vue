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

                <template #actions-data="{ row }">
                    <div class="flex gap-2">
                        <UButton
                            square
                            size="xs"
                            icon="i-heroicons-pencil"
                            color="gray"
                            variant="solid"
                            @click="
                                openEditUserModal({
                                    id: row.id,
                                    email: row.email,
                                    type: row.type,
                                    channels: row.channels,
                                })
                            "
                        />
                        <UButton
                            square
                            size="xs"
                            icon="i-heroicons-trash"
                            color="red"
                            variant="solid"
                            @click="
                                openDeleteUserModal({
                                    id: row.id,
                                    email: row.email,
                                    type: row.type,
                                    channels: row.channels,
                                })
                            "
                        />
                    </div>
                </template>
            </UTable>
        </UFormGroup>

        <!-- MODAL: ADD USER -->
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
                        <div class="flex flex-col gap-4">
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
                                        icon="i-heroicons-plus"
                                        @click="
                                            channels.push({
                                                channelName: '',
                                                channelId: '',
                                            })
                                        "
                                    />
                                </div>

                                <div class="flex flex-col-reverse">
                                    <UButton
                                        square
                                        color="red"
                                        size="xs"
                                        icon="i-heroicons-minus"
                                        @click="channels.splice(index, 1)"
                                        v-if="channels.length > 1"
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

        <!-- MODAL: EDIT USER -->
        <UModal v-model="isEditUserModalOpen">
            <UCard class="overflow-auto">
                <template #header> Edit User </template>

                <div class="flex flex-col gap-6">
                    <UFormGroup size="sm" label="ID">
                        <UInput disabled v-model="selectedUser.id" />
                    </UFormGroup>

                    <UFormGroup size="sm" label="Email" required>
                        <UInput
                            placeholder="you@payreto.com"
                            icon="i-heroicons-envelope"
                            v-model="selectedUser.email"
                        />
                    </UFormGroup>

                    <UFormGroup size="sm" label="Type">
                        <USelect
                            v-model="selectedUser.type"
                            :options="userTypes"
                        />
                    </UFormGroup>

                    <UFormGroup size="sm" label="Channels">
                        <div class="flex flex-col gap-4">
                            <div
                                class="flex flex-row gap-1"
                                v-for="(ch, index) in selectedUser.channels"
                            >
                                <UFormGroup
                                    class="w-full"
                                    size="xs"
                                    label="Name"
                                >
                                    <UInput
                                        placeholder="td-attendance"
                                        v-model="ch.channelName"
                                    />
                                </UFormGroup>

                                <UFormGroup class="w-full" size="xs" label="ID">
                                    <UInput
                                        placeholder="C069FH66QJ3"
                                        v-model="ch.channelId"
                                    />
                                </UFormGroup>

                                <div class="flex flex-col-reverse">
                                    <UButton
                                        square
                                        size="xs"
                                        icon="i-heroicons-plus"
                                        @click="
                                            selectedUser.channels.push({
                                                channelName: '',
                                                channelId: '',
                                            })
                                        "
                                    />
                                </div>

                                <div class="flex flex-col-reverse">
                                    <UButton
                                        square
                                        color="red"
                                        size="xs"
                                        icon="i-heroicons-minus"
                                        @click="
                                            selectedUser.channels.splice(
                                                index,
                                                1
                                            )
                                        "
                                        v-if="selectedUser.channels.length > 1"
                                    />
                                </div>
                            </div>
                        </div>
                    </UFormGroup>
                </div>

                <template #footer>
                    <div class="flex flex-row-reverse">
                        <div class="flex flex-row-reverse">
                            <UButton
                                :loading="isSaveButtonLoading"
                                size="xs"
                                @click="saveEditedUser"
                            >
                                Save
                            </UButton>
                        </div>
                    </div>
                </template>
            </UCard>
        </UModal>

        <!-- MODAL: CONFIRM USER DELETION -->
        <UModal v-model="isDeleteUserModalOpen">
            <UCard
                :ui="{
                    ring: '',
                    divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                }"
            >
                <template #header>
                    <h1>Delete User</h1>
                </template>

                <div class="text-sm">
                    <p>
                        Are you sure you want to delete user
                        <span class="font-medium">
                            {{ selectedUser.email }} </span
                        >?
                    </p>
                </div>

                <template #footer>
                    <div class="flex flex-row-reverse gap-2">
                        <UButton
                            size="xs"
                            color="red"
                            @click="deleteUser(selectedUser.id)"
                        >
                            Delete
                        </UButton>

                        <UButton
                            size="xs"
                            @click="isDeleteUserModalOpen = false"
                        >
                            Cancel
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

    type SelectedUser = {
        id: string
        email: string
        type: string
        channels: TableChannelItem[]
    }

    // states
    const isDevMode = import.meta.env.DEV
    const isTableLoading = ref(true)
    const isAddUserModalOpen = ref(false)
    const isEditUserModalOpen = ref(false)
    const isDeleteUserModalOpen = ref(false)
    const selectedUser = ref<SelectedUser>({
        id: '',
        email: '',
        type: '',
        channels: [],
    })
    const userColumns = [
        { key: 'id', label: 'ID' },
        { key: 'email', label: 'Email' },
        { key: 'type', label: 'Type' },
        { key: 'channels', label: 'Channels' },
        { key: 'actions', label: 'Actions' },
    ]
    const userRows = ref<UserRowItem[]>([])
    const userEmail = ref('')
    const userTypes = ['admin', 'basic']
    const selectedUserType = ref(userTypes[1])
    const channels = ref<TableChannelItem[]>([
        { channelName: '', channelId: '' },
    ])
    const isSaveButtonLoading = ref(false)
    const toast = useToast()

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
        userRows.value = []
        isTableLoading.value = true

        if (isDevMode) console.time('Fetch user list')

        try {
            const response = await fetch('/api/getUsersList')
            if (response.ok) {
                const data = await response.json()

                for (const user of data) {
                    const rowItem: UserRowItem = {
                        id: user.id,
                        email: user.email,
                        type: user.user_metadata.role,
                        channels: user.user_metadata.channels,
                    }

                    userRows.value.push(rowItem)
                }
            }
        } catch (error) {
            console.error('Failed to fetch user list', error)
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
            isSaveButtonLoading.value = false
            return
        }

        for (const channel of channels.value) {
            if (channel.channelName === '' || channel.channelId === '') {
                alert('Channel Name/ID cannot be empty!')
                isSaveButtonLoading.value = false
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

                if (!data.isAddUserSuccess) {
                    alert(data.result.msg)
                    return
                }

                isAddUserModalOpen.value = false
                toast.add({
                    title: 'New User Invited',
                    description: 'An invite email has been sent to the user.',
                    icon: 'i-heroicons-check-badge',
                })
            }
        } catch (error) {
            console.error('Failed to add new user', error)
        } finally {
            isSaveButtonLoading.value = false
            getUserList()
        }
    }

    /**
     * sets the selected row from the table to be deleted
     */
    function openDeleteUserModal(user: SelectedUser) {
        selectedUser.value = user
        isDeleteUserModalOpen.value = true
    }

    /**
     *
     */
    async function deleteUser(userId: string) {
        try {
            const response = await fetch(`/api/deleteUser/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                console.error('Failed to delete user', userId)
                return
            }

            const data = await response.json()
            if (data.status !== 200) {
                console.error('Failed to delete user', data)
                return
            }

            if (isDevMode) console.info('User deleted', data)
            isDeleteUserModalOpen.value = false
            await getUserList()
            toast.add({
                title: 'User Deleted Successfully',
                description: 'The selected user has been deleted.',
                icon: 'i-heroicons-check-badge',
            })
            return
        } catch (error) {
            console.error('Failed to delete user', error)
        }
    }

    /**
     * TODO: Edit user
     */
    function openEditUserModal(user: SelectedUser) {
        // Create a deep copy of the channels array
        const copiedChannels = user.channels.map((channel) => ({
            channelName: channel.channelName,
            channelId: channel.channelId,
        }))

        // Set the selectedUser with the copied channels
        selectedUser.value = {
            id: user.id,
            email: user.email,
            type: user.type,
            channels: copiedChannels, // Use the deep copy here
        }

        isEditUserModalOpen.value = true
    }

    /**
     *
     */
    function saveEditedUser() {
        console.info(selectedUser.value)
    }
</script>
