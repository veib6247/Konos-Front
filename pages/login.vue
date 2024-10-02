<template>
    <div
        class="m-auto flex w-1/5 flex-col gap-4 rounded border border-green-300/30 p-6"
    >
        <div class="my-auto flex flex-col gap-0">
            <h1 class="text-primary text-2xl font-semibold">Kronos</h1>
            <p class="text-xs font-light">Timestamp tracking in Slack</p>
        </div>

        <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
        >
            <UFormGroup size="xs" s label="Email" name="email">
                <UInput size="xs" v-model="state.email" />
            </UFormGroup>

            <UFormGroup size="xs" label="Password" name="password">
                <UInput size="xs" v-model="state.password" type="password" />
            </UFormGroup>

            <UButton type="submit" :loading="isLoading"> Login </UButton>
        </UForm>

        <UAlert
            icon="heroicons:exclamation-triangle-16-solid"
            title="Error"
            color="red"
            variant="solid"
            :description="errorMsg"
            v-if="isError"
        />
    </div>
</template>

<script lang="ts" setup>
    import { z } from 'zod'
    import type { FormSubmitEvent } from '#ui/types'

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const isLoading = ref(false)
    const isError = ref(false)
    const errorMsg = ref('')

    definePageMeta({
        layout: 'un-auth',
    })

    useUpdateTitle('Login')

    const state = reactive({
        email: '',
        password: '',
    })

    const schema = z.object({
        email: z.string().email('Invalid email'),
        password: z.string().min(8, 'Must be at least 8 characters'),
    })

    type Schema = z.output<typeof schema>

    /**
     * submit to supabase to login user
     * @param event
     */
    async function onSubmit(event: FormSubmitEvent<Schema>) {
        isLoading.value = true
        isError.value = false

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: event.data.email,
                password: event.data.password,
            })
            if (user) navigateTo('/')
            if (error) throw error
        } catch (error) {
            isError.value = true
            errorMsg.value = 'Invalid Credentials'
            console.error(error)
        } finally {
            isLoading.value = false
        }
    }
</script>

<style></style>
