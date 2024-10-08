<template>
    <UFormGroup class="my-auto w-full" size="xs" label="Date Range">
        <VueDatePicker
            :dark="true"
            v-model="dateRange"
            :enable-time-picker="false"
            :action-row="{ showPreview: false }"
            :format="format"
            range
        ></VueDatePicker>
    </UFormGroup>
</template>

<script lang="ts" setup>
    import VueDatePicker from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'

    // init date picker with the date today
    const dateRange = useState<DateRange>('dateRange')

    /**
     * date picker UI format
     */
    const format = (dateRange: DateRange) => {
        if (dateRange[1])
            return `${getFormattedDate(dateRange[0])} - ${getFormattedDate(dateRange[1])}`

        return getFormattedDate(dateRange[0])
    }
</script>

<style></style>
