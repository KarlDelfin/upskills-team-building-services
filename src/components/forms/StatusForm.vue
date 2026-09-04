<template>
    <el-dialog 
        :title="statusStore.title" 
        v-model="statusStore.dialog.bookingStatus" 
        :before-close="statusStore.clear"
        width="520px"
        class="custom-dialog rounded-xl overflow-hidden"
        destroy-on-close
        center
    >
        <el-form 
            ref="bookingStatusFormRef" 
            :model="statusStore.bookingStatusForm" 
            v-loading="statusStore.loading"
            label-position="top"
            class="pt-2"
        >
            <el-form-item 
                label="Status Name" 
                prop="name"
                :rules="[{ required: true, message: 'Please enter status name', trigger: 'blur' }]"
            >
                <el-input v-model="statusStore.bookingStatusForm.name" placeholder="Enter status name"  />
            </el-form-item>

            <el-form-item 
              label="Status Color" 
              prop="color"
              :rules="[{ required: true, message: 'Please select status color', trigger: 'change' }]"
            >
              <div class="flex items-center gap-3">
                <el-color-picker v-model="statusStore.bookingStatusForm.color" :show-alpha="false" :predefine="predefineColors"/>
                <el-input v-model="statusStore.bookingStatusForm.color" placeholder="#136cb3" class="w-32" />
              </div>
            </el-form-item>

            <div class="flex justify-end pt-4 border-t border-slate-200 mt-6">
                <el-button 
                    @click="statusStore.clear()" 
                    :loading="statusStore.loading"
                >Cancel</el-button>
                <el-button 
                    type="primary"
                    class="custom-btn-primary" 
                    @click="handleConfirm()" 
                    :loading="statusStore.loading"
                >
                    Confirm
                </el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script lang="ts">
import { useStatusStore } from '@/stores/useStatusStore';

export default {
    setup() {
        const statusStore = useStatusStore()
        return { statusStore }
    },
    data() {
        return {
            predefineColors: [
              '#ff4500',
              '#ff8c00',
              '#ffd700',
              '#90ee90',
              '#00ced1',
              '#1e90ff',
              '#c71585',
              'rgba(255, 69, 0, 0.68)',
              'rgb(255, 120, 0)',
              'hsv(51, 100, 98)',
              'hsva(120, 40, 94, 0.5)',
              'hsl(181, 100%, 37%)',
              'hsla(209, 100%, 56%, 0.73)',
              '#c7158577',
            ],
        }
    },
    methods: {
        async handleConfirm() {
            const formEl = await this.$refs.bookingStatusFormRef as any
            await formEl.validate()

            await this.statusStore.submitForm()
        },
    }
}
</script>