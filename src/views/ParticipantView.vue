<template>
  <el-card class="!shadow-sm !border-0 !rounded-xl !overflow-hidden">
    <template #header>
      <div class="!flex !flex-col sm:!flex-row !justify-between !items-start sm:!items-center !gap-4">
        <div>
          <h2 class="!text-xl !font-bold !m-0">Participant Management</h2>
          <p class="!text-xs !text-slate-500 !m-0 !mt-1">Manage attendees and generate completion certificates</p>
        </div>
      </div>
    </template>

    <div class="!mb-6 !flex !justify-between !w-full !gap-3">
      <div class="!w-full">
        <el-input
          v-model="participantStore.search"
          @input="participantStore.searchEvents"
          placeholder="Search event ID or booking reference..."
          :prefix-icon="Search"
          clearable
        />
      </div>

      <div class="!flex !items-center !justify-end">
        <el-button
          class="!flex"
          @click="participantStore.fetchEvents"
          title="Refresh Data"
          :loading="participantStore.loading"
        >
          <el-icon><Refresh /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- Main Event Table -->
    <el-table
      class="!mb-6 !rounded-lg !overflow-hidden custom-table !min-h-[540px]"
      :data="participantStore.events"
      v-loading="participantStore.loading"
      element-loading-text="Loading events..."
    >
      <el-table-column prop="fullName" label="Client Name" min-width="200" show-overflow-tooltip>
        <template #default="scope">
          <span class="!font-semibold !text-slate-800">{{ scope.row.fullName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="eventDate" label="Event Date" min-width="200">
        <template #default="scope">
          <span>{{ scope.row.eventDate }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="eventLocation" label="Location" min-width="200" show-overflow-tooltip>
        <template #default="scope">
          <span class="!text-slate-600">{{ scope.row.eventLocation || 'Not Set' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Operations" width="320" fixed="right" align="center">
        <template #default="scope">
          <div class="!flex !items-center !justify-center">
            <!-- Edit Event Button -->
            <el-button
              size="small"
              type="warning"
              plain
              @click="participantStore.openEditDialog(scope.row)"
            >
              <el-icon class="!mr-1"><Edit /></el-icon> Edit
            </el-button>

            <!-- View / Generate Certificates -->
            <el-button
              size="small"
              type="primary"
              plain
              @click="participantStore.openParticipantsDrawer(scope.row)"
            >
              <el-icon class="!mr-1"><User /></el-icon> Participants
            </el-button>

            <!-- Generate & Copy Link -->
            <el-button
              size="small"
              type="success"
              plain
              @click="participantStore.handleCreateLink(scope.row)"
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
        v-model:current-page="participantStore.eventPagination.currentPage"
        v-model:page-size="participantStore.eventPagination.elementsPerPage"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="participantStore.eventPagination.totalElements"
        @size-change="participantStore.fetchEvents"
        @current-change="participantStore.fetchEvents"
      />
    </div>

    <!-- EDIT EVENT DIALOG -->
    <el-dialog v-model="participantStore.editDialogVisible" title="Edit Event Details" width="500px">
      <el-form label-position="top">
        <el-form-item label="Event Date">
          <el-date-picker
            v-model="participantStore.editForm.eventDate"
            type="date"
            placeholder="Select date"
            class="!w-full"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="Event Location / Venue Name">
          <el-input
            v-model="participantStore.editForm.eventLocation"
            placeholder="e.g. Waterfront Cebu City Hotel / Zoom"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="participantStore.editDialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="participantStore.savingEvent" @click="participantStore.saveEventChanges">
          Save Changes
        </el-button>
      </template>
    </el-dialog>

    <!-- DRAWER -->
    <el-drawer
      v-model="participantStore.drawerVisible"
      :title="`Participants for Event: ${participantStore.selectedEvent?.fullName || participantStore.selectedEvent?.id || ''}`"
      size="50%"
      direction="rtl"
    >
      <div class="!flex !flex-col !h-full !gap-4">
        <div class="!flex !justify-between !items-center !bg-slate-50 !p-3 !rounded-lg !border !border-slate-200">
          <div>
            <p class="!text-xs !text-slate-500 !m-0">Total Registered</p>
            <h3 class="!text-lg !font-bold !text-slate-800 !m-0">{{ participantStore.participants.length }} Attendees</h3>
          </div>
          <el-button
            type="primary"
            :loading="participantStore.isGeneratingPdf"
            :disabled="participantStore.participants.length === 0"
            @click="participantStore.generateAllCertificates"
          >
            <el-icon class="!mr-1"><Download /></el-icon> Generate Certifications (All)
          </el-button>
        </div>

        <div class="!flex !gap-2">
          <el-input
            v-model="participantStore.fullName"
            placeholder="Quick add participant full name..."
            @keyup.enter="participantStore.addQuickParticipant"
          />
          <el-input
            v-model="participantStore.email"
            placeholder="Quick add participant email..."
            @keyup.enter="participantStore.addQuickParticipant"
          />
          <el-button type="primary" @click="participantStore.addQuickParticipant">
            <el-icon><Plus /></el-icon>
          </el-button>
        </div>

        <el-empty v-if="participantStore.participants.length === 0" description="No participants"/>
        <el-table v-else :data="participantStore.participants" v-loading="participantStore.loadingParticipants" class="!flex-1 !rounded-lg !border !border-gray-300" stripe>
          <el-table-column type="index" label="#" width="50" align="center" />
          <el-table-column prop="fullName" label="Participant Name" />
          <el-table-column prop="email" label="Email" min-width="140">
            <template #default="scope">
              <span class="!text-xs !text-slate-400">
                <a v-if="scope.row.email" :href="`mailto:${scope.row.email}`">{{ scope.row.email }}</a>
                <span v-else>N/A</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="Action" width="100" align="center">
            <template #default="scope">
              <el-button
                size="small"
                type="danger"
                link
                @click="participantStore.deleteParticipant(scope.row.id)"
              >
                Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>

    <!-- Share Link Dialog -->
    <el-dialog v-model="participantStore.linkDialogVisible" title="Share Roster Link" width="460px">
      <p class="!text-sm !text-slate-600 !mb-3">
        Send this link to attendees or the event coordinator. Any names submitted will link directly to this Event:
      </p>
      <el-input v-model="participantStore.generatedLink" readonly>
        <template #append>
          <el-button @click="participantStore.copyToClipboard">Copy</el-button>
        </template>
      </el-input>
      <template #footer>
        <el-button @click="participantStore.linkDialogVisible = false">Close</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { markRaw } from 'vue'
import { Search, Refresh, Plus, User, Link, Download, Edit } from '@element-plus/icons-vue'
import { useParticipantStore } from '@/stores/useParticipantStore'

export default {
  components: {
    Search: markRaw(Search),
    Refresh: markRaw(Refresh),
    Plus: markRaw(Plus),
    User: markRaw(User),
    Link: markRaw(Link),
    Download: markRaw(Download),
    Edit: markRaw(Edit)
  },
  setup() {
    const participantStore = useParticipantStore()
    return { participantStore, Search: markRaw(Search) }
  },
  mounted() {
    if(this.participantStore.events.length === 0) {
      this.participantStore.fetchEvents()
    }
  }
}
</script>