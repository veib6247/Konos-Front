<template>
    <UFormGroup class="my-auto w-full" size="xs" label="Date Range">
        <VueDatePicker
            :dark="true"
            v-model="dateRange"
            :format="format"
            range
        ></VueDatePicker>
    </UFormGroup>
</template>

<script lang="ts" setup>
    import VueDatePicker from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'

    // init date picker with the date today
    // const dateRange = ref<DateRange>([new Date(), new Date()])
    const dateRange = useState<DateRange>('dateRange', () => {
        return [new Date(), new Date()]
    })

    /**
     * date picker UI format
     */
    const format = (dateRange: DateRange) => {
        if (dateRange[1])
            return `from ${getFormattedDate(dateRange[0])} - to ${getFormattedDate(dateRange[1])}`

        return getFormattedDate(dateRange[0])
    }
</script>

<style></style>
