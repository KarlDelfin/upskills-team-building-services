import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabaseClient'
import { ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'

import { markRaw } from 'vue'
import { Delete } from '@element-plus/icons-vue'

export interface BookingTimeSlot {
    id: number,
    slotTime: string,
    isActive: boolean,
    dateTimeCreated: string,
    disabled: boolean
}

export const useTimeSlotStore = defineStore('timeSlot', {
    state: () => ({
        title: '' as String,
        loading: false as Boolean,
        search: '' as String,

        timeSlots: [] as BookingTimeSlot[],
        timeSlotForm: {
            id: 0,
            slotTime: '',
            isActive: true,
            dateTimeCreated: '',
            disabled: false,
        } as BookingTimeSlot,

        dialog: {
            timeSlot: false as Boolean,
        }

    }),
    actions: {
        /* GET TIME SLOT WITH SEARCH */
        async fetchTimeSlots() {
            try {
                this.loading = true

                let query = supabase
                    .from('TimeSlot')
                    .select('*', { count: 'exact' })
                    .eq('isActive', true)
                    .order('slotTime', { ascending: true });

                query = query.order('dateTimeCreated', { ascending: false })

                const { data, error, count } = await query;

                if(error) throw error

                this.timeSlots = data.map((data: BookingTimeSlot) => ({
                    ...data,
                    dateTimeCreated: moment(data.dateTimeCreated).format('LLL'),
                    slotTime: moment(data.slotTime, 'HH:mm:ss').format('hh:mm A'),
                })) || []
            }
            catch(error) {
                console.error(error)
            }
            finally {
                this.loading = false
            }
        },

        /* DELETE */
        async deleteTimeSlot(id: string) {
            try {
                await ElMessageBox.confirm('Do you want to delete this time slot?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning',
                    icon: markRaw(Delete),
                })

                this.loading = true

                const { error } = await supabase
                    .from('TimeSlot')
                    .delete()
                    .eq('id', id)

                if (error) throw error

                ElMessage.success('Time Slot deleted successfully.')
                this.fetchTimeSlots()

            } catch (error) {
                console.error(error)
            } finally {
                this.loading = false
            }
        },

        /* CREATE / UPDATE FORM */
        async submitForm() {
            try{
                if(this.title === 'Create Time Slot') {
                  const payload = {
                      slotTime: moment(this.timeSlotForm.slotTime).format('HH:mm:ss'),
                  }
                  const { error } = await supabase
                  .from('TimeSlot')
                  .insert(payload) 

                  if(error) throw error

                  ElMessage.success('Time Slot created successfully.')
                }

                if(this.title === 'Edit Time Slot') {
                  const payload = {
                    slotTime: moment(this.timeSlotForm.slotTime).format('HH:mm:ss'),
                    isActive: this.timeSlotForm.isActive
                  }
                    const { error } = await supabase
                    .from('TimeSlot')
                    .update(payload)
                    .eq('id', this.timeSlotForm.id)

                    if(error) throw error

                    ElMessage.success('Time Slot updated successfully.')
                }
            } catch (error) {
                console.error(error)
            } finally {
                this.loading = false
                this.fetchTimeSlots()
                this.dialog.timeSlot = false
            }
        },

        /* STATUS TOGGLE */
        async handleStatusToggle(timeSlotId: string, value: boolean) {
          try{
            const { error } = await supabase
              .from('TimeSlot')
              .update({ isActive: value })
              .eq('id', timeSlotId)

            if(error) throw error
          } catch (error) {
                console.error(error)
          } finally {
              this.loading = false
              this.dialog.timeSlot = false
          }
        },

        /* DIALOG CONTROLLER */
        formController(title: string, timeSlot: any) {
            this.title = title
            this.dialog.timeSlot = true

            if(title == "Created Time Slot") {}

            if(title == "Edit Time Slot") {
                const todayStr = new Date().toISOString().split('T')[0]; // "2026-08-27"
                const dateObj = new Date(`${todayStr} ${timeSlot.slotTime}`);
                this.timeSlotForm = { 
                    ...timeSlot,
                    slotTime: dateObj
                 }
            }
        },

        /* CLEAR */
        clear() {
            Object.assign(this.timeSlotForm, {
                id: '',
                slotTime: '',
                isActive: true,
                dateTimeCreated: '',
                disabled: '',
            })
            this.dialog.timeSlot = false
        }
    }
})