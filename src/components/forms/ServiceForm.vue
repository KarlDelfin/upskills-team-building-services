<template>
    <el-dialog 
        :title="serviceStore.title" 
        v-model="serviceStore.dialog.service" 
        :before-close="serviceStore.clear"
        width="520px"
        class="custom-dialog rounded-xl overflow-hidden"
        destroy-on-close
        center
    >
        <el-form 
            ref="serviceFormRef" 
            :model="serviceStore.serviceForm" 
            v-loading="serviceStore.loading"
            label-position="top"
            class="pt-2"
        >
            <el-form-item 
              label="Name"
              prop="name"
              :rules="[{ required: true, message: 'Please input name', trigger: 'blur' }]"
            >
              <el-input v-model="serviceStore.serviceForm.name" placeholder="Enter name" />
            </el-form-item>

            <el-form-item 
              label="Description" 
              prop="description"
              :rules="[{ required: true, message: 'Please input description', trigger: 'blur' }]"
            >
              <el-input v-model="serviceStore.serviceForm.description" type="textarea" placeholder="Enter description" />
            </el-form-item>

            <el-form-item 
              label="Price" 
              prop="price"
              :rules="[
                { required: true, message: 'Please input price', trigger: 'blur' },
                { type: 'number', message: 'Price must be a number', trigger: 'blur' }]"
            >
              <el-input v-model.number="serviceStore.serviceForm.price" placeholder="Enter price" />
            </el-form-item>



            <div class="flex justify-end pt-4 border-t border-slate-200 mt-6">
                <el-button 
                    @click="serviceStore.clear()" 
                    :loading="serviceStore.loading"
                >Cancel</el-button>
                <el-button 
                    type="primary"
                    class="custom-btn-primary" 
                    @click="handleConfirm()" 
                    :loading="serviceStore.loading"
                >
                    Confirm
                </el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script lang="ts">
import { useServiceStore } from '@/stores/useServiceStore';

export default {
    setup() {
        const serviceStore = useServiceStore()
        return { serviceStore }
    },
    methods: {
        async handleConfirm() {
            const formEl = await this.$refs.serviceFormRef as any
            await formEl.validate()

            await this.serviceStore.submitForm()
        },
    }
}
</script>