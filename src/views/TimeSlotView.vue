<template>
    <el-card class="shadow-sm border-0 rounded-xl overflow-hidden">
        <template #header>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 class="!text-xl !font-bold !m-0">{{ $route.name }} Management</h2>
                    <p class="!text-xs !m-0 !mt-1">Configure available daily time schedules for client bookings</p>
                </div>
            </div>
        </template>

        <div class="!mb-6 flex justify-end w-full gap-3">

            <div class="flex items-center justify-end">
                <el-button 
                    class="custom-btn-secondary"
                    @click="timeSlotStore.fetchTimeSlots()"
                    title="Refresh Data"
                    :loading="timeSlotStore.loading"
                >
                    <el-icon><Refresh /></el-icon>
                </el-button>
                <el-button 
                    class="custom-btn-primary flex items-center" 
                    @click="timeSlotStore.formController('Create Time Slot', {})"
                    type="primary"
                >
                    <el-icon><Plus /></el-icon>
                    <span>Create Time Slot</span>
                </el-button>
            </div>
        </div>

        <!-- DATA TABLE -->
        <el-table 
          class="mb-6 rounded-lg overflow-hidden custom-table min-h-[540px]" 
          :data="timeSlotStore.timeSlots" 
          v-loading="timeSlotStore.loading"
          element-loading-text="Loading time slots..."
        >
          <el-table-column label="Time Slot" min-width="160">
            <template #default="scope">
              <span class="font-bold text-slate-800 text-sm">
                {{ scope.row.slotTime }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="Status" width="140" align="center">
            <template #default="scope">
              <el-switch
                v-model="scope.row.isActive"
                active-color="#136cb3"
                @change="(val: boolean) => timeSlotStore.handleStatusToggle(scope.row.id, val)"
              />
            </template>
          </el-table-column>

          <el-table-column label="Operations" width="160" fixed="right" align="center">
              <template #default="scope">
                  <div class="flex items-center justify-center">
                      <el-button 
                          size="small"
                          class="custom-btn-edit" 
                          @click="timeSlotStore.formController('Edit Time Slot', scope.row)"
                      >
                          <el-icon class="!mr-1"><Edit /></el-icon> Edit
                      </el-button>
                      <el-button 
                          size="small" 
                          type="danger" 
                          plain
                          @click="timeSlotStore.deleteTimeSlot(scope.row.id)"
                      >
                          <el-icon class="!mr-1"><Delete /></el-icon> Delete
                      </el-button>
                  </div>
              </template>
          </el-table-column>
        </el-table>
    </el-card>

    <TimeSlotForm />
</template>

<script lang="ts">
import { useTimeSlotStore } from '@/stores/useTimeSlotStore'
import { markRaw } from 'vue'
import { Search } from '@element-plus/icons-vue'
import moment from 'moment';

import TimeSlotForm from '@/components/forms/TimeSlotForm.vue'

export default {
    components: {
        Search: markRaw(Search),
        TimeSlotForm
    },
    setup() {
        const timeSlotStore = useTimeSlotStore()
        return { timeSlotStore }
    },
    data() {
        return {
            Search,
        }
    },
    mounted() {
        if(this.timeSlotStore.timeSlots.length === 0) {
            this.timeSlotStore.fetchTimeSlots()
        }
    }
}
</script>