<template>
    <div class="my-auto w-full">
        <UFormGroup size="xs" label="User(s)">
            <USelectMenu
                searchable
                clear-search-on-close
                v-model="selectedUsers"
                :options="users"
                size="sm"
                multiple
            />
        </UFormGroup>
    </div>
</template>

<script lang="ts" setup>
    // const supabase = useSupabaseClient()
    const users = useState<UIMenuItems>('availableUsers')
    const selectedUsers = useState<UIMenuItem[]>('selectedUser')

    /**
     *
     */
    // const getUsers = async () => {
    //     try {
    //         const { data } = await supabase.from('App Users').select('*')
    //         if (data) {
    //             for (const channel of data) {
    //                 const item = channel as UserItem
    //                 users.value.push({
    //                     id: item.user_id,
    //                     label: item.user_name,
    //                     icon: 'heroicons:user-circle-16-solid',
    //                 })
    //             }
    //         }
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }

    // await getUsers()
</script>

<style></style>
