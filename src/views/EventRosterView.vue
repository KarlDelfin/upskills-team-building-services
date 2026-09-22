<template>
  <div class="!min-h-screen !w-full !bg-slate-50 !flex !items-center !justify-center !px-3 !py-6 sm:!px-6 sm:!py-12 md:!py-16">
    <el-card class="!w-full !max-w-2xl !shadow-sm sm:!shadow-md !rounded-xl sm:!rounded-2xl !border-0" v-loading="fetchingData">
      <template #header>
        <div class="!py-1 sm:!py-2">
          <h2 class="!text-lg sm:!text-xl !font-bold !text-slate-800 !m-0">Participant Roster Entry</h2>
          <p class="!text-xs sm:!text-sm !text-slate-500 !mt-1.5 !mb-0 !leading-relaxed">
            Please enter the full names of attendees exactly as they should appear on the certificates.
          </p>
        </div>
      </template>

      <el-form
        ref="eventRosterFormRef"
        :model="participantForm"
        label-position="top"
        class="!mt-1"
      >
        <div
          v-for="(item, index) in participantForm.participants"
          :key="item.key"
          class="!p-3 sm:!p-4 !mb-3 !bg-slate-50/75 !rounded-lg sm:!rounded-xl !border !border-slate-200/90 !transition-all"
        >
          <div class="!flex !justify-between !items-center !mb-2.5">
            <span class="!text-xs !font-semibold !uppercase !tracking-wider !text-slate-600">
              Participant #{{ index + 1 }}
            </span>
            <el-button
              v-if="participantForm.participants.length > 1"
              type="danger"
              link
              size="small"
              class="!p-0 !text-xs"
              @click.prevent="removeParticipant(item)"
            >
              Remove
            </el-button>
          </div>

          <div class="!grid !grid-cols-1 md:!grid-cols-2 !gap-x-4 !gap-y-1">
            <el-form-item
              :label="'Full Name'"
              :prop="'participants.' + index + '.fullName'"
              :rules="{
                required: true,
                message: 'Name is required',
                trigger: 'blur'
              }"
              class="!mb-2.5"
            >
              <el-input
                v-model="item.fullName"
                size="large"
                class="!w-full"
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
              class="!mb-2.5"
            >
              <el-input
                v-model="item.email"
                size="large"
                class="!w-full"
                placeholder="maria@company.com"
              />
            </el-form-item>
          </div>
        </div>

        <div class="!flex !flex-col !gap-2.5 !mt-5">
          <el-button
            type="dashed"
            size="large"
            class="!w-full !h-11 !font-medium"
            @click="addParticipant"
          >
            + Add Another Participant
          </el-button>

          <el-button
            type="primary"
            size="large"
            class="!w-full !h-11 !font-semibold !shadow-sm !ml-0"
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
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { supabase } from '@/utils/supabaseClient'

interface ParticipantItem {
  key: number
  id?: string
  fullName: string
  email: string
}

export default defineComponent({
  name: 'ParticipantRosterView',
  data() {
    return {
      eventId: '' as string,
      loading: false,
      fetchingData: false,
      participantForm: {
        participants: [] as ParticipantItem[]
      }
    }
  },

  methods: {
    addParticipant() {
      this.participantForm.participants.push({
        key: Date.now() + Math.random(),
        fullName: '',
        email: ''
      })
    },

    removeParticipant(targetItem: ParticipantItem) {
      const index = this.participantForm.participants.indexOf(targetItem)
      if (index !== -1) {
        this.participantForm.participants.splice(index, 1)
      }
    },

    async getParticipants() {
      if (!this.eventId) return

      this.fetchingData = true
      try {
        const { data, error } = await supabase
          .from('Participant')
          .select('id, fullName, email')
          .eq('eventId', this.eventId)
          .order('dateTimeCreated', { ascending: true })

        if (error) throw error

        if (data && data.length > 0) {
          this.participantForm.participants = data.map((item: any) => ({
            key: item.id || Date.now() + Math.random(),
            id: item.id,
            fullName: item.fullName || '',
            email: item.email || ''
          }))
        } else {
          this.participantForm.participants = [
            { key: Date.now(), fullName: '', email: '' }
          ]
        }
      } catch (error: any) {
        console.error('Failed to retrieve participants:', error)
        ElMessage.error(error.message || 'Failed to retrieve participants.')
        this.participantForm.participants = [
          { key: Date.now(), fullName: '', email: '' }
        ]
      } finally {
        this.fetchingData = false
      }
    },

    async submitRoster() {
      const formEl = this.$refs.eventRosterFormRef as any
      if (!formEl) return

      await formEl.validate()

      if (!this.eventId) {
        ElMessage.error('Invalid link: missing Event ID.')
        return
      }

      this.loading = true
      try {
        // 1. Delete existing records for this event
        const { error: deleteError } = await supabase
          .from('Participant')
          .delete()
          .eq('eventId', this.eventId)

        if (deleteError) throw deleteError

        // 2. Prepare payload and insert updated roster
        const payload = this.participantForm.participants.map((p) => ({
          eventId: this.eventId,
          fullName: p.fullName.trim(),
          email: p.email ? p.email.trim() : null
        }))

        const { error: insertError } = await supabase
          .from('Participant')
          .insert(payload)

        if (insertError) throw insertError

        ElMessage.success('Participant list successfully updated!')

        // 3. Refresh from database to sync IDs
        await this.getParticipants()
      } catch (error: any) {
        ElMessage.error(error.message || 'Failed to submit roster.')
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  },

  mounted() {
    this.eventId = (this.$route.params.id as string) || (this.$route.params.eventId as string) || ''
    this.getParticipants()
  }
})
</script>

<style>
.banner figure img { display: none; }
</style>