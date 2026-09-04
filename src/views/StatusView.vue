<template>
    <el-card class="shadow-sm border-0 rounded-xl overflow-hidden">
        <template #header>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 class="!text-xl !font-bold !m-0">{{ $route.name }} Management</h2>
                    <p class="!text-xs !m-0 !mt-1">Configure and organize operational statuses for client bookings</p>
                </div>
            </div>
        </template>

        <div class="!mb-6 flex justify-between w-full gap-3">
            <div class="w-full">
                <el-input
                    v-model="statusStore.search"
                    @input="statusStore.searchBookingStatus" 
                    placeholder="Search status..." 
                    :prefix-icon="Search"
                    clearable
                />
            </div>

            <div class="flex items-center justify-end">
                <el-button 
                    class="flex"
                    @click="statusStore.fetchBookingStatuses()"
                    title="Refresh Data"
                    :loading="statusStore.loading"
                >
                    <el-icon><Refresh /></el-icon>
                </el-button>
                <el-button 
                    class="custom-btn-primary flex items-center" 
                    @click="statusStore.formController('Create Status', {})"
                    type="primary"
                >
                    <el-icon><Plus /></el-icon>
                    <span>Create Status</span>
                </el-button>
            </div>
        </div>

        <el-table 
            class="mb-6 rounded-lg overflow-hidden custom-table min-h-[540px]" 
            :data="statusStore.bookingStatuses" 
            v-loading="statusStore.loading"
            element-loading-text="Loading statuses..."
        >
            <el-table-column prop="name" label="Status Name" sortable>
                <template #default="scope">
                    <span class="font-semibold">{{ scope.row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column label="Color" min-width="150">
              <template #default="scope">
                <div class="flex items-center gap-2">
                  <span 
                    class="w-4 h-4 rounded-full border border-slate-200 inline-block shadow-sm" 
                    :style="{ backgroundColor: scope.row.color || '#94a3b8' }"
                  ></span>
                  <span class="text-xs font-mono font-semibold text-slate-600">
                    {{ scope.row.color || 'N/A' }}
                  </span>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="Operations" width="160" fixed="right" align="center">
                <template #default="scope">
                    <div class="flex items-center justify-center">
                        <el-button 
                            size="small"
                            class="custom-btn-edit" 
                            @click="statusStore.formController('Edit Status', scope.row)"
                        >
                            <el-icon class="!mr-1"><Edit /></el-icon> Edit
                        </el-button>
                        <el-button 
                            size="small" 
                            type="danger" 
                            plain
                            @click="statusStore.deleteBookingStatus(scope.row.id)"
                        >
                            <el-icon class="!mr-1"><Delete /></el-icon> Delete
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- PRODUCT PAGINATION -->
        <div class="flex justify-end !pt-5">
            <el-pagination
                v-model:current-page="statusStore.bookingStatusPagination.currentPage"
                v-model:page-size="statusStore.bookingStatusPagination.elementsPerPage"
                :page-sizes="[5, 10, 25, 50]"
                :total="statusStore.bookingStatusPagination.totalElements"
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="statusStore.fetchBookingStatuses()"
                @size-change="statusStore.fetchBookingStatuses()"
            />
        </div>
    </el-card>

    <StatusForm />
    
</template>

<script lang="ts">
import { useStatusStore } from '@/stores/useStatusStore'
import { markRaw } from 'vue'
import { Search } from '@element-plus/icons-vue'

import StatusForm from '@/components/forms/StatusForm.vue'

export default {
    components: {
        Search: markRaw(Search),
        StatusForm
    },
    setup() {
        const statusStore = useStatusStore()
        return { statusStore }
    },
    data() {
        return {
            Search,
        }
    },
    methods: {
        async handleConfirm() {
            const formEl = await this.$refs.bookingStatusFormRef as any
            await formEl.validate()

            await this.statusStore.submitForm()
        }
    },
    mounted() {
        if(this.statusStore.bookingStatuses.length === 0) {
            this.statusStore.fetchBookingStatuses()
        }
    }
}
</script>