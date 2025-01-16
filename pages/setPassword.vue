<template>
    <div
        class="m-auto flex w-1/4 flex-col gap-4 rounded border border-green-300/30 p-6"
    >
        <div class="my-auto flex flex-col gap-6">
            <div>
                <h1 class="text-primary text-2xl font-semibold">Kronos</h1>
                <p class="text-xs font-light">Timestamp tracking in Slack</p>
            </div>

            <div class="space-y-2" v-if="token">
                <p class="text-xs font-light">Please set your new password</p>

                <UForm
                    :schema="schema"
                    :state="state"
                    class="space-y-4"
                    @submit="onSubmit"
                >
                    <UFormGroup size="xs" label="Password" name="password">
                        <UInput v-model="state.password" type="password" />
                    </UFormGroup>

                    <div class="flex justify-end">
                        <UButton size="xs" type="submit">
                            Set my password
                        </UButton>
                    </div>

                    <UAlert
                        icon="heroicons:exclamation-triangle-16-solid"
                        title="Error"
                        color="red"
                        variant="solid"
                        :description="errMsg"
                        v-if="errMsg"
                    />
                </UForm>
            </div>

            <div v-else>
                <UAlert
                    icon="heroicons:exclamation-triangle-16-solid"
                    title="Error"
                    color="red"
                    variant="solid"
                    description="Invalid or expired token. Please request a new password
                    reset link."
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { z } from 'zod'
    import type { FormSubmitEvent } from '#ui/types'

    useUpdateTitle('Set Password')
    definePageMeta({
        layout: 'un-auth',
    })

    const hash = useRoute().hash.substring(1)
    const params = new URLSearchParams(hash)
    const errMsg = ref('')
    const token = params.get('access_token')
    const schema = z.object({
        password: z.string().min(8, 'Must be at least 8 characters'),
    })

    type Schema = z.output<typeof schema>

    const state = reactive({
        password: undefined,
    })

    /**
     * update the password
     * @param event
     */
    async function onSubmit(event: FormSubmitEvent<Schema>) {
        try {
            const data = await fetch('/api/updatePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: event.data.password,
                    accessToken: token,
                }),
            })

            if (!data.ok) {
                const response = await data.json()
                errMsg.value = response
                console.error('Error setting password:', response)

                return
            }

            await navigateTo('/')
        } catch (error) {
            const msg = 'Error resetting password:'
            errMsg.value = msg
            console.error(msg, error)
        }
    }
</script>
