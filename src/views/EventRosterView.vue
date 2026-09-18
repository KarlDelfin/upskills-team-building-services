<template>
<div class="!py-[100px] !bg-slate-50 !flex !items-center !justify-center !p-4">
    <el-card class="!w-full !max-w-xl !shadow-md !rounded-2xl !border-0">
      <template #header>
        <div>
          <h2 class="!text-xl !font-bold !text-slate-800 !m-0">Participant Roster Entry</h2>
          <p class="!text-xs !text-slate-500 !mt-1 !mb-0">
            Please enter the full names of attendees exactly as they should appear on the certificates.
          </p>
        </div>
      </template>

      <el-form
        ref="eventRosterFormRef"
        :model="participantForm"
        label-position="top"
        class="!mt-2"
      >
        <div
          v-for="(item, index) in participantForm.participants"
          :key="item.key"
          class="!p-3 !mb-3 !bg-slate-50 !rounded-lg !border !border-slate-200 !relative"
        >
          <div class="!flex !justify-between !items-center !mb-2">
            <span class="!text-xs !font-semibold !text-slate-600">Participant #{{ index + 1 }}</span>
            <el-button
              v-if="participantForm.participants.length > 1"
              type="danger"
              link
              size="small"
              @click.prevent="removeParticipant(item)"
            >
              Remove
            </el-button>
          </div>

          <div class="!grid !grid-cols-1 sm:!grid-cols-2 !gap-3">
            <el-form-item
              :label="'Full Name'"
              :prop="'participants.' + index + '.fullName'"
              :rules="{
                required: true,
                message: 'Name is required',
                trigger: 'blur'
              }"
              class="!mb-2"
            >
              <el-input
                v-model="item.fullName"
                placeholder="e.g. Maria Santos"
              />
            </el-form-item>

            <el-form-item
              :label="'Email (Optional)'"
              :prop="'participants.' + index + '.email'"
              :rules="{
                type: 'email',
                message: 'Enter a valid email',
                trigger: ['blur', 'change']
              }"
              class="!mb-2"
            >
              <el-input
                v-model="item.email"
                placeholder="maria@company.com"
              />
            </el-form-item>
          </div>
        </div>

        <div class="!flex !flex-col !gap-3 !mt-4">
          <el-button
            type="dashed"
            class="!w-full"
            @click="addParticipant"
          >
            + Add Another Participant
          </el-button>

          <el-button
            type="primary"
            class="!w-full"
            :loading="loading"
            @click="submitRoster"
          >
            Submit Participant List ({{ participantForm.participants.length }})
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script lang="ts">
import { ElMessage } from 'element-plus'
import { supabase } from '@/utils/supabaseClient'

interface ParticipantItem {
  key: number
  fullName: string
  email: string
}

export default {
    data() {
        return {
        eventId: '' as string,
        loading: false,
        participantForm: {
            participants: [
            { key: Date.now(), fullName: '', email: '' }
            ] as ParticipantItem[]
        }
        }
    },

    methods: {
        getStorageKey(): string {
            return this.eventId ? `roster_draft_${this.eventId}` : 'roster_draft_default'
        },

        saveDraft() {
            localStorage.setItem(this.getStorageKey(), JSON.stringify(this.participantForm.participants))
        },

        restoreDraft() {
            const saved = localStorage.getItem(this.getStorageKey())
            if (saved) {
                try {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    this.participantForm.participants = parsed
                }
                } catch {
                localStorage.removeItem(this.getStorageKey())
                }
            }
        },

        addParticipant() {
            this.participantForm.participants.push({
                key: Date.now() + Math.random(),
                fullName: '',
                email: ''
            })
            this.saveDraft()
        },

        removeParticipant(targetItem: ParticipantItem) {
            const index = this.participantForm.participants.indexOf(targetItem)
            if (index !== -1) {
                this.participantForm.participants.splice(index, 1)
                this.saveDraft()
            }
        },

        async submitRoster() {
            const formEl = await this.$refs.eventRosterFormRef as any
            await formEl.validate()
        
            if (!this.eventId) {
                ElMessage.error('Invalid link: missing Event ID.')
                return
            }

            this.loading = true
            try {
            const payload = this.participantForm.participants.map((p) => ({
                eventId: this.eventId,
                fullName: p.fullName.trim(),
                email: p.email ? p.email.trim() : null
            }))

            const { error } = await supabase
                .from('Participant')
                .insert(payload)

            if (error) throw error

            ElMessage.success('Participant list successfully submitted!')

            localStorage.removeItem(this.getStorageKey())
            this.participantForm.participants = [
                { key: Date.now(), fullName: '', email: '' }
            ]
            } catch (error: any) {
                ElMessage.error(error.message)
                console.error(error)
            } finally {
            this.loading = false
            }
        }
    },
    mounted() {
        this.eventId = (this.$route.params.id as string) || (this.$route.params.eventId as string) || ''
        this.restoreDraft()
    },
}
</script>

<style>
.banner figure img { display: none; }
</style>