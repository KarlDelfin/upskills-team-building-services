<template>
    <el-dialog 
        :title="timeSlotStore.title" 
        v-model="timeSlotStore.dialog.timeSlot" 
        :before-close="timeSlotStore.clear"
        width="520px"
        class="custom-dialog rounded-xl overflow-hidden"
        destroy-on-close
        center
    >
        <el-form 
            ref="timeSlotFormRef" 
            :model="timeSlotStore.timeSlotForm" 
            v-loading="timeSlotStore.loading"
            label-position="top"
            class="pt-2"
        >
            <el-form-item 
              label="Slot Time" 
              prop="slotTime"
              :rules="[{ required: true, message: 'Please select a time slot', trigger: 'change' }]"
            >
              <el-time-picker
                v-model="timeSlotStore.timeSlotForm.slotTime"
                placeholder="Select time"
                class="!w-full"
                format="hh:mm A"
                />
            </el-form-item>

            <el-form-item label="Active Status" prop="isActive">
              <el-switch v-model="timeSlotStore.timeSlotForm.isActive" active-text="Active" inactive-text="Inactive" />
            </el-form-item>


            <div class="flex justify-end pt-4 border-t border-slate-200 mt-6">
                <el-button 
                    @click="timeSlotStore.clear()" 
                    :loading="timeSlotStore.loading"
                >Cancel</el-button>
                <el-button 
                    type="primary"
                    class="custom-btn-primary" 
                    @click="handleConfirm()" 
                    :loading="timeSlotStore.loading"
                >
                    Confirm
                </el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script lang="ts">
import { useTimeSlotStore } from '@/stores/useTimeSlotStore'

export default {
    setup() {
        const timeSlotStore = useTimeSlotStore()
        return { timeSlotStore }
    },
    methods: {
        async handleConfirm() {
            const formEl = await this.$refs.timeSlotFormRef as any
            await formEl.validate()

            await this.timeSlotStore.submitForm()
        }
    }
}
</script>