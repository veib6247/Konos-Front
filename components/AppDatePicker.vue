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

<style>
    .dp__theme_dark {
        --dp-font-size: 13px;
        --dp-border-radius: 0.375rem;
        --dp-cell-border-radius: 0.375rem;
        --dp-background-color: #111827;
        --dp-text-color: #fff;
        --dp-hover-color: #484848;
        --dp-hover-text-color: #fff;
        --dp-hover-icon-color: #959595;
        --dp-primary-color: #4ade80;
        --dp-primary-disabled-color: #61a8ea;
        --dp-primary-text-color: #fff;
        --dp-secondary-color: #a9a9a9;
        --dp-border-color: rgb(55 65 81);
        --dp-menu-border-color: rgb(55 65 81);
        --dp-border-color-hover: rgb(55 65 81);
        --dp-border-color-focus: rgb(55 65 81);
        --dp-disabled-color: #737373;
        --dp-disabled-color-text: #d0d0d0;
        --dp-scroll-bar-background: #212121;
        --dp-scroll-bar-color: #484848;
        --dp-success-color: #00701a;
        --dp-success-color-disabled: #428f59;
        --dp-icon-color: #959595;
        --dp-danger-color: #e53935;
        --dp-marker-color: #e53935;
        --dp-tooltip-color: #3e3e3e;
        --dp-highlight-color: #4ade80;
        --dp-range-between-dates-background-color: var(
            --dp-hover-color,
            #484848
        );
        --dp-range-between-dates-text-color: var(--dp-hover-text-color, #fff);
        --dp-range-between-border-color: var(--dp-hover-color, #fff);
    }
</style>
