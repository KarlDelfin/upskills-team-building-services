<template>
  <div class="p-3 sm:p-6 rounded-2xl shadow-lg w-full min-h-[600px] block">
    <div 
      v-loading="calendarStore.loading.calendar" 
      element-loading-text="Loading calendar events..."
      class="w-full min-h-[550px] relative"
    >
      <FullCalendar 
        ref="calendarRef" 
        :options="calendarOptions as any" 
      />
    </div>

    <!-- VIEW CALENDAR EVENT -->
    <ViewEventForm  @refreshCalendar="handleRefreshClick" />
    
    <!-- SCHEDULE BOOKING FORM -->
    <ScheduleBookingForm @refreshCalendar="handleRefreshClick"/>
  </div>
</template>

<script lang="ts">

import { markRaw } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import rrulePlugin from '@fullcalendar/rrule'

import moment from 'moment'
import { useCalendarStore, type CalendarEvent } from '@/stores/useCalendarStore'

import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'

import ScheduleBookingForm from '@/components/forms/ScheduleBookingForm.vue'
import ViewEventForm from '@/components/forms/ViewEventForm.vue'


export default {
  name: 'CalendarView',
  components: {
    FullCalendar,
    ScheduleBookingForm,
    ViewEventForm
  },
  setup() {
    const calendarStore = useCalendarStore() 
    return { calendarStore }
  },
  data() {
    const vm = this as any

    return {
      calendarOptions: markRaw({
        height: '650px',
        contentHeight: 600,
        expandRows: true,
        handleWindowResize: true,
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin, rrulePlugin],
        timeZone: 'UTC',
        editable: true,
        eventStartEditable: true,
        eventDurationEditable: false,
        initialView: 'dayGridMonth',
        headerToolbar: {
          start: 'prevCustom,todayCustom,nextCustom refreshCustom',
          center: 'title',
          end: 'monthCustom,weekCustom,dayCustom,listCustom'
        },
        customButtons: {
          todayCustom: { text: 'today', click: () => vm.handleTodayClick() },
          prevCustom: { text: '«', click: () => vm.handlePrevClick() },
          nextCustom: { text: '»', click: () => vm.handleNextClick() },
          refreshCustom: { text: '⟲ Refresh', click: () => vm.handleRefreshClick() },
          monthCustom: { text: 'month', click: () => vm.handleMonthClick() },
          weekCustom: { text: 'week', click: () => vm.handleWeekClick() },
          dayCustom: { text: 'day', click: () => vm.handleDayClick()},
          listCustom: { text: 'list', click: () => vm.handleListClick() }
        },
        events: [] as CalendarEvent[],
        firstDay: 0,
        eventClick: this.handleEventClick,
        selectable: true,
        eventDrop: this.handleEventDrop,
        datesSet: this.handleDatesSet,
        allDaySlot: false,
        eventOverlap: true,
        displayEventTime: true,
        dateClick: this.handleDateClick
      })
    }
  },
  computed: {
    calendarApi(): any {
      return (this.$refs.calendarRef as any) ? (this.$refs.calendarRef as any).getApi() : null
    },
  },
  methods: {
    /* CLICK DATE */
    async handleDateClick(info: any) {
      if (new Date(info.dateStr) < new Date(new Date().setHours(0, 0, 0, 0))) {
        ElMessage.warning('Cannot schedule on past dates.')
        return
      }

      const targetDate = moment(info.dateStr).format('YYYY-MM-DD')
      this.calendarStore.selectedDateStr = info.dateStr
      
      this.calendarStore.calendarEventForm.bookingId = this.calendarStore.selectedBookingId
      this.calendarStore.calendarEventForm.eventDate = targetDate

      this.calendarStore.formController('Schedule Booking to Calendar')
    },

    /* CLICK EVENT */
    async handleEventClick(info: any) {
      this.calendarStore.selectedDateStr = info.event.extendedProps.bookingDate
      this.calendarStore.selectedBooking = info.event
      this.calendarStore.dialog.viewEvent = true
      this.calendarStore.title = 'Booking Event Details'
      this.calendarStore.calendarEventForm.id = info.event.extendedProps.eventId
    },

    /* MOVE EVENT */
    async handleEventDrop(info: any) {
      if (new Date(info.event.startStr) < new Date(new Date().setHours(0, 0, 0, 0))) {
        ElMessage.warning('Cannot move booking on past dates.')
        info.revert()
        return
      }
      ElMessageBox.confirm(`Are you sure you want to move ${info.event.extendedProps.title} to ${moment(info.event.startStr).format('LL')}?`, 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        icon: markRaw(Edit),
      }).then(() => {
        const targetDate = moment(info.event.start).format('YYYY-MM-DD')
        const eventId = info.event.extendedProps.eventId

        this.calendarStore.calendarEventForm.eventDate = targetDate
        this.calendarStore.calendarEventForm.id = eventId
        this.calendarStore.title = 'Reschedule Booking Event Date'
        this.calendarStore.submitForm()
      })
      .catch(() => {
        this.updateCalendarSource()
      })
      .finally(() => { })
    },

    

    /* LOAD EVENTS DIRECTLY ON MOUNT */
    async handleDatesSet(dateInfo: any) {
      await this.loadEvents(dateInfo.startStr, dateInfo.endStr)
    },

    /* REFRESH EVENT */
    async handleRefreshClick() {
      if (this.calendarApi) {
        const currentView = this.calendarApi.view
        await this.loadEvents(currentView.activeStart.toISOString(), currentView.activeEnd.toISOString())
      }
    },

    /* LOAD EVENTS */
    async loadEvents(startDate: string, endDate: string) {
      const events = await this.calendarStore.fetchCalendarEvents(startDate, endDate)
      this.updateCalendarSource()
    },
   
    /* UPDATE CALENDAR STATIC DATES */
    updateCalendarSource() {
      if (this.calendarApi) {
        this.calendarApi.removeAllEventSources()
        this.calendarApi.addEventSource(this.calendarStore.events)
      } else {
        this.calendarOptions.events = this.calendarStore.events
      }
    },

    handleTodayClick() { this.calendarApi?.today() },
    handlePrevClick() { this.calendarApi?.prev() },
    handleNextClick() { this.calendarApi?.next() },
    handleMonthClick() { this.calendarApi?.changeView('dayGridMonth') },
    handleWeekClick() { this.calendarApi?.changeView('timeGridWeek') },
    handleDayClick() { this.calendarApi?.changeView('timeGridDay') },
    handleListClick() { this.calendarApi?.changeView('listMonth') }
  },
}
</script>

<style scoped>
:deep(.fc) {
  min-height: 550px !important;
  width: 100% !important;
}

:deep(.fc-view-harness) { 
  min-height: 500px !important;
}

:deep(.fc-event) {
  border-radius: 6px !important;
  border: none !important;
  cursor: pointer;
}

:deep(.fc-day-past) {
  background-color: #f0f0f0 !important; /* Light gray for past dates */
}

:deep(.fc-event-time) { display: none !important; }
</style>