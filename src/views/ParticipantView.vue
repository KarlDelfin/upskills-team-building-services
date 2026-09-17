<template>
  <el-card class="!shadow-sm !border-0 !rounded-xl !overflow-hidden">
    <template #header>
      <div class="!flex !flex-col sm:!flex-row !justify-between !items-start sm:!items-center !gap-4">
        <div>
          <h2 class="!text-xl !font-bold !m-0">Certification Management</h2>
          <p class="!text-xs !text-slate-500 !m-0 !mt-1">Manage attendees and generate completion certificates</p>
        </div>
      </div>
    </template>

    <div class="!mb-6 !flex !justify-between !w-full !gap-3">
      <div class="!w-full">
        <el-input
          v-model="search"
          @input="searchEvents"
          placeholder="Search event ID or booking reference..."
          :prefix-icon="Search"
          clearable
        />
      </div>

      <div class="!flex !items-center !justify-end">
        <el-button
          class="!flex"
          @click="fetchEvents"
          title="Refresh Data"
          :loading="loading"
        >
          <el-icon><Refresh /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- Main Event Table -->
    <el-table
      class="!mb-6 !rounded-lg !overflow-hidden custom-table !min-h-[540px]"
      :data="events"
      v-loading="loading"
      element-loading-text="Loading events..."
    >
      <el-table-column prop="id" label="Client Name" min-width="220" show-overflow-tooltip>
        <template #default="scope">
          <span class="!font-semibold !text-slate-800">{{ scope.row.fullName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="eventDate" label="Event Date" width="180">
        <template #default="scope">
          <span>{{ scope.row.eventDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Operations" width="280" fixed="right" align="center">
        <template #default="scope">
          <div class="!flex !items-center !justify-center !gap-2">
            <!-- View / Generate Certificates -->
            <el-button
              size="small"
              type="primary"
              plain
              @click="openParticipantsDrawer(scope.row)"
            >
              <el-icon class="!mr-1"><User /></el-icon> Participants
            </el-button>

            <!-- Generate & Copy Link -->
            <el-button
              size="small"
              type="success"
              plain
              @click="handleCreateLink(scope.row)"
            >
              <el-icon class="!mr-1"><Link /></el-icon> Create Link
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- PAGINATION -->
    <div class="!flex !justify-end !mt-4">
      <el-pagination
        v-model:current-page="eventPagination.currentPage"
        v-model:page-size="eventPagination.elementsPerPage"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="eventPagination.totalElements"
        @size-change="fetchEvents"
        @current-change="fetchEvents"
      />
    </div>

    <!-- DRAWER -->
    <el-drawer
      v-model="drawerVisible"
      :title="`Participants for Event: ${selectedEvent?.id || ''}`"
      size="50%"
      direction="rtl"
    >
      <div class="!flex !flex-col !h-full !gap-4">
        <div class="!flex !justify-between !items-center !bg-slate-50 !p-3 !rounded-lg !border !border-slate-200">
          <div>
            <p class="!text-xs !text-slate-500 !m-0">Total Registered</p>
            <h3 class="!text-lg !font-bold !text-slate-800 !m-0">{{ participants.length }} Attendees</h3>
          </div>
          <el-button
            type="primary"
            :loading="isGeneratingPdf"
            :disabled="participants.length === 0"
            @click="generateAllCertificates"
          >
            <el-icon class="!mr-1"><Download /></el-icon> Generate All (ZIP)
          </el-button>
        </div>

        <div class="!flex !gap-2">
          <el-input
            v-model="fullName"
            placeholder="Quick add participant full name..."
            @keyup.enter="addQuickParticipant"
          />
          <el-input
            v-model="email"
            placeholder="Quick add participant email..."
            @keyup.enter="addQuickParticipant"
          />
      
          <el-button type="primary" @click="addQuickParticipant">
            <el-icon><Plus /></el-icon>
          </el-button>
        </div>
        <el-empty v-if="participants.length === 0" description="No participants"/>
        <el-table v-else :data="participants" v-loading="loadingParticipants" class="!flex-1 !rounded-lg !border" stripe>
          <el-table-column type="index" label="#" width="50" align="center" />
          <el-table-column prop="fullName" label="Participant Name" />
          <el-table-column prop="email" label="Email" min-width="140">
            <template #default="scope">
              <span class="!text-xs !text-slate-400">{{ scope.row.email || 'None' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Action" width="100" align="center">
            <template #default="scope">
              <el-button
                size="small"
                type="danger"
                link
                @click="deleteParticipant(scope.row.id)"
              >
                Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>

    <!-- Share Link Dialog -->
    <el-dialog v-model="linkDialogVisible" title="Share Roster Link" width="460px">
      <p class="!text-sm !text-slate-600 !mb-3">
        Send this link to attendees or the event coordinator. Any names submitted will link directly to this Event:
      </p>
      <el-input v-model="generatedLink" readonly>
        <template #append>
          <el-button @click="copyToClipboard">Copy</el-button>
        </template>
      </el-input>
      <template #footer>
        <el-button @click="linkDialogVisible = false">Close</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import { Search, Refresh, Plus, User, Link, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { supabase } from '@/utils/supabaseClient'
import debounce from 'lodash/debounce'
import moment from 'moment'
import jsPDF from 'jspdf'
import JSZip from 'jszip'

interface EventRecord {
  id: string
  eventDate: string
  bookingId?: string
  dateTimeCreated?: string
}

interface ParticipantRecord {
  id: string
  eventId: string
  fullName: string
}

export default defineComponent({
  name: 'CertificateGeneratorView',
  components: {
    Search: markRaw(Search),
    Refresh: markRaw(Refresh),
    Plus: markRaw(Plus),
    User: markRaw(User),
    Link: markRaw(Link),
    Download: markRaw(Download)
  },
  data() {
    return {
      Search: markRaw(Search),
      loading: false,
      search: '',
      events: [] as EventRecord[],
      eventPagination: {
        currentPage: 1,
        elementsPerPage: 10,
        totalElements: 0
      },
      drawerVisible: false,
      linkDialogVisible: false,
      isGeneratingPdf: false,
      loadingParticipants: false,
      selectedEvent: null as EventRecord | null,
      generatedLink: '',
      fullName: '',
      email: '',
      participants: [] as ParticipantRecord[]
    }
  },
  mounted() {
    this.fetchEvents()
  },
  methods: {
    /* DEBOUNCE SEARCH */
    searchEvents: debounce(function(this: any) {
      this.eventPagination.currentPage = 1
      this.fetchEvents()
    }, 300),

    /* FETCH EVENTS ONLY */
    async fetchEvents() {
      try {
        this.loading = true

        const limit = this.eventPagination.elementsPerPage
        const from = (this.eventPagination.currentPage - 1) * limit
        const to = from + limit - 1

        let query = supabase
          .from('Event')
          .select(`
          id, 
          eventDate, 
          bookingId, 
          dateTimeCreated,
          Booking (
            id,
            fullName
          )
          `, { count: 'exact' })

        if (this.search && this.search.trim() !== '') {
          query = query.or(`id.ilike.%${this.search}%,bookingId.ilike.%${this.search}%`)
        }

        query = query.order('eventDate', { ascending: false }).range(from, to)

        const { data, error, count } = await query
        if (error) throw error

        this.events = (data || []).map((event: any) => ({
          id: event.id,
          bookingId: event.bookingId,
          eventDate: event.eventDate ? moment(event.eventDate).format('LL') : 'N/A',
          fullName: event.Booking.fullName
        }))

        console.log(this.events)

        this.eventPagination.totalElements = count || 0
      } catch (error: any) {
        console.error('Failed to load events:', error)
        ElMessage.error(error.message || 'Failed to load events.')
      } finally {
        this.loading = false
      }
    },

    /* CREATE ROSTER LINK */
    async handleCreateLink(event: EventRecord) {
      this.selectedEvent = event
      this.generatedLink = `${window.location.origin}/event-roster/${event.id}`

      try {
        await navigator.clipboard.writeText(this.generatedLink)
        ElMessage.success('Link copied to clipboard!')
      } catch {
        // Fallback opens dialog for manual copy
      }

      this.linkDialogVisible = true
    },

    copyToClipboard() {
      navigator.clipboard.writeText(this.generatedLink)
      ElMessage.success('Link copied!')
    },

    /* DRAWER & PARTICIPANTS */
    async openParticipantsDrawer(event: EventRecord) {
      this.selectedEvent = event
      this.drawerVisible = true
      await this.fetchParticipants(event.id)
    },

    async fetchParticipants(eventId: string) {
      this.loadingParticipants = true
      try {
        const { data, error } = await supabase
          .from('Participant')
          .select('*')
          .eq('eventId', eventId)
          .order('dateTimeCreated', { ascending: true })

        if (error) throw error
        this.participants = (data as ParticipantRecord[]) || []
      } catch (err: any) {
        ElMessage.error(err.message || 'Failed to load participants.')
      } finally {
        this.loadingParticipants = false
      }
    },

    async addQuickParticipant() {
      if (!this.fullName.trim() || !this.selectedEvent) return

      try {
        const payload = {
          eventId: this.selectedEvent.id,
          fullName: this.fullName.trim(),
        }

        const { data, error } = await supabase
          .from('Participant')
          .insert([payload])
          .select()

        if (error) throw error
        if (data) this.participants.push(data[0] as ParticipantRecord)

        this.fullName = ''
        ElMessage.success('Participant added!')
      } catch (err: any) {
        ElMessage.error(err.message || 'Could not add participant.')
      }
    },

    async deleteParticipant(id: string) {
      try {
        const { error } = await supabase.from('Participant').delete().eq('id', id)
        if (error) throw error

        this.participants = this.participants.filter(p => p.id !== id)
        ElMessage.success('Participant removed.')
      } catch (err: any) {
        ElMessage.error(err.message || 'Failed to delete participant.')
      }
    },

    /* GENERATE CERTIFICATES */
    async generateAllCertificates() {
      if (this.participants.length === 0) return

      this.isGeneratingPdf = true
      try {
        const zip = new JSZip()
        const eventTitle = `Event_${this.selectedEvent?.id?.slice(0, 8) || 'Certificates'}`

        for (const p of this.participants) {
          const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
          const width = doc.internal.pageSize.getWidth()
          const height = doc.internal.pageSize.getHeight()

          // Border frame
          doc.setDrawColor(30, 41, 59)
          doc.setLineWidth(1.5)
          doc.rect(10, 10, width - 20, height - 20)

          // Title
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(26)
          doc.setTextColor(30, 41, 59)
          doc.text('CERTIFICATE OF PARTICIPATION', width / 2, 45, { align: 'center' })

          doc.setFont('helvetica', 'normal')
          doc.setFontSize(12)
          doc.setTextColor(100, 116, 139)
          doc.text('This is proudly awarded to', width / 2, 65, { align: 'center' })

          // Name
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(24)
          doc.setTextColor(15, 23, 42)
          doc.text(p.fullName.toUpperCase(), width / 2, 92, { align: 'center' })
          doc.line(width / 2 - 50, 96, width / 2 + 50, 96)

          // Subtitle / Body
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(12)
          doc.setTextColor(71, 85, 105)
          doc.text('for completing the program on', width / 2, 115, { align: 'center' })
          doc.setFont('helvetica', 'bold')
          doc.text(this.selectedEvent?.eventDate || 'Completion Date', width / 2, 125, { align: 'center' })

          // Footer info
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(10)
          doc.text(`Issued on: ${moment().format('YYYY-MM-DD')}`, 25, 175)
          doc.text('Authorized Facilitator', width - 65, 175)
          doc.line(width - 70, 170, width - 20, 170)

          const blob = doc.output('blob')
          zip.file(`${p.fullName.replace(/\s+/g, '_')}_Certificate.pdf`, blob)
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const downloadUrl = URL.createObjectURL(zipBlob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `${eventTitle}_Certificates.zip`
        link.click()
        URL.revokeObjectURL(downloadUrl)

        ElMessage.success('Certificates generated successfully!')
      } catch (err) {
        console.error(err)
        ElMessage.error('Error generating certificate files.')
      } finally {
        this.isGeneratingPdf = false
      }
    }
  }
})
</script>