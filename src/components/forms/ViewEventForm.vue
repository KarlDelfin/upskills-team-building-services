<template>
    <el-dialog 
      v-model="calendarStore.dialog.viewEvent" 
      :title="calendarStore.title" 
      class="!w-[92vw] sm:!w-[440px] !max-w-[440px] !rounded-xl" 
      center 
      destroy-on-close
    >
      <div v-if="calendarStore.selectedBooking" v-loading="calendarStore.loading.viewEvent" class="!space-y-4 !text-slate-700">
        <div class="flex items-center justify-between !border-b !border-slate-100 !pb-3">
          <span class="!font-semibold !text-slate-500 !text-sm">Status</span>
          <span 
            class="!px-3 !py-1 !text-xs !font-bold !rounded-full !text-white !shadow-sm"
            :style="{ backgroundColor: calendarStore.selectedBooking.backgroundColor || '#136cb3' }"
          >
            {{ calendarStore.selectedBooking.extendedProps.status }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 !gap-2.5 !text-sm !pt-1 items-start sm:items-center">
          <span class="!text-slate-500 !font-medium">Client / Service:</span>
          <span class="sm:col-span-2 !font-bold !text-slate-800 !break-words">{{ calendarStore.selectedBooking.title }}</span>

          <span class="!text-slate-500 !font-medium">Scheduled Date:</span>
          <span class="sm:col-span-2 !font-semibold !text-slate-700 flex flex-col !gap-2 !w-full"> <div>{{ calendarStore.selectedDateStr }}</div> </span>

          <span class="!text-slate-500 !font-medium">Email:</span>
          <span class="sm:col-span-2 !text-slate-700 !break-all">{{ calendarStore.selectedBooking.extendedProps.email || 'N/A' }}</span>

          <span class="!text-slate-500 !font-medium">Phone:</span>
          <span class="sm:col-span-2 !text-slate-700">{{ calendarStore.selectedBooking.extendedProps.phone || 'N/A' }}</span>

          <span class="!text-slate-500 !font-medium">Participants:</span>
          <span class="sm:col-span-2 !text-slate-700 !font-semibold">
            {{ calendarStore.selectedBooking.extendedProps.noOfParticipants }} pax
          </span>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <el-button class="!w-full sm:!w-auto" @click="calendarStore.dialog.viewEvent = false">Close</el-button>
          <el-button type="danger" class="!w-full sm:!w-auto" @click="handleDeleteEvent">Delete</el-button>
        </div>
      </template>
    </el-dialog>
</template>
<script lang="ts">
import { useCalendarStore } from '@/stores/useCalendarStore'
export default {
    setup() {
        const calendarStore = useCalendarStore()
        return { calendarStore }
    },
    methods: {
        /* DELETE EVENT */
        async handleDeleteEvent() {
            await this.calendarStore.handleDeleteEvent()
            this.$emit('refreshCalendar')
        },
    }
}
</script>