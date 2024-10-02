<template>
    <div class="my-auto w-full">
        <UFormGroup size="xs" label="User(s)">
            <USelectMenu
                searchable
                v-model="selected"
                :options="users"
                size="xs"
                multiple
            />
        </UFormGroup>
    </div>
</template>

<script lang="ts" setup>
    import type { UIMenuItems, UIMenuItem, UserItem } from '~/types'

    const supabase = useSupabaseClient()
    const users = ref<UIMenuItems>([])
    const selected = useState('selectedUser', () => {
        return ref<UIMenuItem[]>([])
    })

    /**
     *
     */
    const getUsers = async () => {
        try {
            const { data } = await supabase.from('App Users').select('*')
            if (data) {
                for (const channel of data) {
                    const item = channel as UserItem
                    users.value.push({
                        id: item.user_id,
                        label: item.user_name,
                        icon: 'heroicons:user-circle-16-solid',
                    })
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    await getUsers()
</script>

<style></style>
