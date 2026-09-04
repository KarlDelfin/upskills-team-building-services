<template>
    <!-- SCHEDULE BOOKING -->
    <el-dialog 
      v-model="calendarStore.dialog.createEvent"
      :title="calendarStore.title" 
      class="!w-[92vw] sm:!w-[440px] !max-w-[440px]" 
      center
    >
      <div class="!space-y-4">
        <p class="!text-sm !text-slate-600">
          Target Date: <strong class="!text-slate-800">{{ selectedDateFormatted }}</strong>
        </p>

        <div class="!space-y-2">
          <label class="block !text-sm !font-medium !text-slate-700">Booking:</label>
          <el-select 
            v-model="calendarStore.selectedBookingId" 
            placeholder="Select a booking" 
            class="!w-full"
            size="large"
            filterable
            remote
            :remote-method="calendarStore.searchUnassignedBookings"
            @change="handleSelectBooking"
            :loading="calendarStore.loading.unassignedBooking"
            loading-text="Fetching bookings, please wait..."
          >
            <el-option
              v-for="unassignedBooking in calendarStore.unassignedBookings"
              :key="unassignedBooking.id"
              :label="`${unassignedBooking.fullName} - ${unassignedBooking.Service?.name || 'Service'}`"
              :value="unassignedBooking.id"
            />
          </el-select>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button 
            type="primary" 
            color="#136cb3" 
            :loading="calendarStore.loading.createEvent"
            :disabled="!calendarStore.selectedBookingId" 
            @click="handleConfirm"
          >
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
</template>

<script lang="ts">
import { useCalendarStore } from '@/stores/useCalendarStore'
import moment from 'moment'

export default {
    setup() {
        const calendarStore = useCalendarStore()
        return { calendarStore }
    },
    computed: {
        selectedDateFormatted(): string {
            return this.calendarStore.selectedDateStr ? moment(this.calendarStore.selectedDateStr).format('MMMM DD, YYYY') : ''
        }
    },
    methods: {
        /* SELECT BOOKING */
        handleSelectBooking(bookingId: string) {
            this.calendarStore.calendarEventForm.bookingId = bookingId
        },

        /* HANDLE CONFIRM */
        async handleConfirm() {
            const ok = this.calendarStore.submitForm()
            if(await ok) {
                this.$emit('refreshCalendar')
            }
            this.calendarStore.selectedBookingId = ''
        },
    }
}
</script>