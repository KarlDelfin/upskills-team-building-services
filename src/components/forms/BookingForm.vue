<template>
    <!-- BOOKING FORM DIALOG -->
    <el-dialog 
        v-model="bookingStore.dialog.booking" 
        :title="bookingStore.title" 
        center 
        class="custom-dialog !w-[95%] sm:!w-[80%] md:!w-[650px] lg:!w-[750px] !max-w-[800px] !rounded-xl"
        :before-close="bookingStore.clear"
    >
        <el-form 
        ref="bookingFormRef" 
        label-position="top" 
        :model="bookingStore.bookingForm" 
        v-loading="bookingStore.loading"
        @submit.prevent="handleConfirm" 
        >
        <div class="grid grid-cols-1 md:grid-cols-2 !gap-x-5 !gap-y-2">
            <el-form-item 
            label="Service"
            prop="serviceId"
            :rules="[{ required: true, message: 'Please select service', trigger: 'change' }]"
            >
            <el-select 
                filterable 
                @input="serviceStore.searchService" 
                :loading="bookingStore.loading" 
                placeholder="Select Service"
                v-model="bookingStore.bookingForm.serviceId"
                class="!w-full"
            >
                <el-option 
                v-for="service in serviceStore.services" 
                :key="service.id" 
                :label="service.name" 
                :value="service.id"
                />
            </el-select>
            </el-form-item>

            <el-form-item 
            label="Status"
            prop="statusId"
            :rules="[{ required: true, message: 'Please select status', trigger: 'change' }]"
            >
            <el-select 
                filterable 
                @input="statusStore.searchBookingStatus" 
                :loading="bookingStore.loading" 
                placeholder="Select Status"
                v-model="bookingStore.bookingForm.statusId"
                class="!w-full"
            >
                <el-option 
                class="!flex !justify-between !items-center"
                v-for="status in statusStore.bookingStatuses" 
                :key="status.id" 
                :label="status.name" 
                :value="status.id" 
                >
                {{ status.name }}
                </el-option>
            </el-select>
            </el-form-item>
        </div>
        
        <!-- Date & Time Selection -->
        <div class="grid grid-cols-1 md:grid-cols-2 !gap-5 !mt-2">
            <el-form-item 
            class="!w-full" 
            label="Preferred Date" 
            prop="bookingDate"
            :rules="[{ required: true, message: 'Please choose preferred date', trigger: 'change' }]">
            <div class="!w-full !overflow-x-auto">
                <VCalendar expanded @dayclick="bookingStore.handleSelectDate" :min-date="new Date()" :attributes="bookingStore.vCalendarEvents"/>
            </div>
            </el-form-item>

            <el-form-item 
            class="!w-full" 
            label="Preferred Time" 
            prop="timeSlotId"
            :rules="[{ required: true, message: 'Please choose preferred time', trigger: 'change' }]">
            <div class="grid grid-cols-2 sm:grid-cols-3 !gap-2 !w-full !max-h-[280px] !overflow-y-auto !pr-1">
                <button
                type="button"
                v-for="timeSlot in timeSlotStore.timeSlots"
                :key="timeSlot.id"
                class="!w-full !border !border-[#ccc] !rounded-[5px] !py-2 !px-2 !text-xs !text-center transition-colors"
                :class="{ active: bookingStore.bookingForm.timeSlotId === timeSlot.id, disabled: timeSlot.disabled }"
                @click="!timeSlot.disabled && bookingStore.handleSelectTime(timeSlot.id)"
                :disabled="timeSlot.disabled"
                >
                {{ timeSlot.slotTime }}
                </button>
            </div>
            </el-form-item>
        </div>

        <!-- User Information Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 !gap-x-5 !gap-y-1 !mt-2">
            <el-form-item 
            label="Full Name"
            prop="fullName"
            :rules="[{ required: true, message: 'Please input full name', trigger: 'blur' }]"
            >
            <el-input v-model="bookingStore.bookingForm.fullName" placeholder="Enter Client Full Name"/>
            </el-form-item>

            <el-form-item 
            label="Email" 
            prop="email"
            :rules="[
                { required: true, message: 'Please input email address', trigger: 'blur' },
                { pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: 'Please input correct email address', trigger: ['blur', 'change'] }
            ]"
            >
            <el-input v-model="bookingStore.bookingForm.email" placeholder="Enter Client Email"/>
            </el-form-item>

            <el-form-item 
            label="Phone" 
            prop="phone"
            :rules="[
                { required: true, message: 'Please input phone number', trigger: 'blur' },
                { pattern: /^09\d{9}$/, message: 'Must be a valid PH mobile number starting with 09', trigger: ['blur', 'change'] }
            ]"
            >
            <el-input v-model="bookingStore.bookingForm.phone" maxlength="11" placeholder="Enter Client Phone Number"/>
            </el-form-item>

            <el-form-item 
            label="No of Participants" 
            prop="noOfParticipants"
            :rules="[{ required: true, message: 'Please input a digit', trigger: 'blur' }]"
            >
            <el-input-number v-model="bookingStore.bookingForm.noOfParticipants" :min="1" class="!w-full" placeholder="Enter No of Participants"/>
            </el-form-item>
        </div>

        <div class="!mt-6 flex !justify-end !gap-2">
            <el-button @click="bookingStore.clear()">Cancel</el-button>
            <el-button 
            type="primary" 
            color="#136cb3" 
            class="custom-btn-primary !font-semibold" 
            @click="handleConfirm"
            :loading="bookingStore.loading"
            >
            Confirm
            </el-button>
        </div>
        </el-form>
    </el-dialog>
</template>

<script lang="ts">
import { useBookingStore } from '@/stores/useBookingStore';
import { useServiceStore } from '@/stores/useServiceStore';
import { useTimeSlotStore } from '@/stores/useTimeSlotStore';
import { useStatusStore } from '@/stores/useStatusStore';

export default {
    setup() {
        const bookingStore = useBookingStore()
        const serviceStore = useServiceStore()
        const timeSlotStore = useTimeSlotStore()
        const statusStore = useStatusStore()

        return { bookingStore, serviceStore, timeSlotStore, statusStore }
    },
    methods: {
        async handleConfirm() {
            const formEl = await this.$refs.bookingFormRef as any
            await formEl.validate()

            await this.bookingStore.submitForm()
        },
    }
}
</script>