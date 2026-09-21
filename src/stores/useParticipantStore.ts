import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabaseClient'
import { ElMessage } from 'element-plus'
import debounce from 'lodash/debounce'
import moment from 'moment'
import jsPDF from 'jspdf'
import JSZip from 'jszip'

import logoImg from '@/assets/image/logo.png'
import certificateBg from '@/assets/image/certificate-bg.png'
import signature1Img from '@/assets/image/signature1.png'
import signature2Img from '@/assets/image/signature2.png'

export interface EventRecord {
  id: string
  eventDate: string
  rawEventDate: string
  bookingId?: string
  dateTimeCreated?: string
  eventLocation?: string
  fullName?: string
}

export interface ParticipantRecord {
  id: string
  eventId: string
  fullName: string
  email?: string
}

export const useParticipantStore = defineStore('participants', {
  state: () => ({
    loading: false,
    loadingParticipants: false,
    savingEvent: false,
    isGeneratingPdf: false,

    search: '',
    events: [] as EventRecord[],
    selectedEvent: null as EventRecord | null,
    participants: [] as ParticipantRecord[],

    eventPagination: {
      currentPage: 1,
      elementsPerPage: 10,
      totalElements: 0
    },

    drawerVisible: false,
    linkDialogVisible: false,
    editDialogVisible: false,

    // Form states
    fullName: '',
    email: '',
    generatedLink: '',
    editForm: {
      id: '',
      eventDate: '',
      eventLocation: ''
    }
  }),

  actions: {
    /* SEARCH WITH DEBOUNCE */
    debouncedSearch: debounce(function (this: any) {
      this.eventPagination.currentPage = 1
      this.fetchEvents()
    }, 300),

    searchEvents() {
      this.debouncedSearch()
    },

    /* FETCH EVENTS */
    async fetchEvents() {
      try {
        this.loading = true

        const limit = this.eventPagination.elementsPerPage
        const from = (this.eventPagination.currentPage - 1) * limit
        const to = from + limit - 1

        let query = supabase
            .from('Event')
            .select(`
                *,
                Booking!inner (
                id,
                fullName
                )`, { count: 'exact' })

        if (this.search && this.search.trim() !== '') {
            const { data: matchingBookings, error: bookingSearchError } = await supabase
              .from('Booking')
              .select('id')
              .ilike('fullName', `%${this.search.trim()}%`)

            if (bookingSearchError) throw bookingSearchError

            const bookingIds = (matchingBookings || []).map((booking: { id: string }) => booking.id)

            if (bookingIds.length > 0) {
              query = query.or(
                `eventLocation.ilike.%${this.search.trim()}%,bookingId.in.(${bookingIds.join(',')})`
              )
            } else {
              query = query.ilike('eventLocation', `%${this.search.trim()}%`)
            }
        }
        query = query.order('eventDate', { ascending: false }).range(from, to)

        const { data, error, count } = await query
        if (error) throw error

        this.events = (data || []).map((event: any) => ({
          id: event.id,
          bookingId: event.bookingId,
          rawEventDate: event.eventDate,
          eventDate: event.eventDate ? moment(event.eventDate).format('LL') : 'N/A',
          eventLocation: event.eventLocation || '',
          fullName: event.Booking?.fullName || 'Client',
          Booking: event.Booking
        }))

        this.eventPagination.totalElements = count || 0

      } catch (error: any) {
        console.error('Failed to load events:', error)
        ElMessage.error(error.message || 'Failed to load events.')
      } finally {
        this.loading = false
      }
    },

    /* EDIT EVENT LOGIC */
    openEditDialog(event: EventRecord) {
      this.selectedEvent = event
      this.editForm = {
        id: event.id,
        eventDate: event.rawEventDate || '',
        eventLocation: event.eventLocation || ''
      }
      this.editDialogVisible = true
    },

    async saveEventChanges() {
      if (!this.editForm.id) return

      try {
        this.savingEvent = true

        const { error } = await supabase
          .from('Event')
          .update({
            eventDate: this.editForm.eventDate,
            eventLocation: this.editForm.eventLocation.trim()
          })
          .eq('id', this.editForm.id)

        if (error) throw error

        await this.fetchEvents()

        if (this.selectedEvent && this.selectedEvent.id === this.editForm.id) {
          this.selectedEvent.rawEventDate = this.editForm.eventDate
          this.selectedEvent.eventDate = this.editForm.eventDate ? moment(this.editForm.eventDate).format('LL') : 'N/A'
          this.selectedEvent.eventLocation = this.editForm.eventLocation.trim()
        }

        ElMessage.success('Event details updated successfully!')
        this.editDialogVisible = false
      } catch (err: any) {
        console.error(err)
        ElMessage.error(err.message || 'Failed to update event.')
      } finally {
        this.savingEvent = false
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
        // Fallback allows manual copy inside the dialog
      }

      this.linkDialogVisible = true
    },

    copyToClipboard() {
      navigator.clipboard.writeText(this.generatedLink)
      ElMessage.success('Link copied!')
    },

    /* PARTICIPANT DRAWER & CRUD */
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
          email: this.email.trim() || null
        }

        const { data, error } = await supabase
          .from('Participant')
          .insert([payload])
          .select()

        if (error) throw error
        if (data) this.participants.push(data[0] as ParticipantRecord)

        this.fullName = ''
        this.email = ''
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

    /* Optimized Canvas Base64 Loader with Compression */
    async loadBase64Image(src: string, isOpaque = false, quality = 0.85): Promise<{ data: string; format: 'JPEG' | 'PNG' }> {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {
            const canvas = document.createElement('canvas')
            
            // Cap maximum dimensions to 2480px width (standard 300 DPI A4) to prevent bloated 4K/8K canvases
            const maxDim = 2480
            let w = img.naturalWidth
            let h = img.naturalHeight
            if (w > maxDim) {
                h = Math.round((h * maxDim) / w)
                w = maxDim
            }

            canvas.width = w
            canvas.height = h

            const ctx = canvas.getContext('2d')
            if (!ctx) {
                reject(new Error('Failed to get canvas 2D context'))
                return
            }

            // If converting to JPEG, paint a white background first to avoid black transparency artifacts
            if (isOpaque) {
                ctx.fillStyle = '#ffffff'
                ctx.fillRect(0, 0, w, h)
                ctx.drawImage(img, 0, 0, w, h)
                resolve({ data: canvas.toDataURL('image/jpeg', quality), format: 'JPEG' })
            } else {
                // Keep PNG for transparent logos and signatures
                ctx.drawImage(img, 0, 0, w, h)
                resolve({ data: canvas.toDataURL('image/png'), format: 'PNG' })
            }
            }
            img.onerror = (err) => reject(err)
            img.src = src
        })
    },
    /* GENERATE COMPRESSED CERTIFICATES */
    async generateAllCertificates() {
        if (this.participants.length === 0) return

        this.isGeneratingPdf = true
        try {
            const zip = new JSZip()
            const eventTitle = `Event_${this.selectedEvent?.id?.slice(0, 8) || 'Certificates'}`

            // 1. Preload with target formats:
            // Background: Opaque JPEG with 0.82 quality (Huge size reduction)
            // Logo & Signatures: Transparent PNG
            let bgAsset: {
                data: string;format: 'JPEG' | 'PNG'
            } | null = null
            let logoAsset: {
                data: string;format: 'JPEG' | 'PNG'
            } | null = null
            let leftSigAsset: {
                data: string;format: 'JPEG' | 'PNG'
            } | null = null
            let rightSigAsset: {
                data: string;format: 'JPEG' | 'PNG'
            } | null = null

            try {
                bgAsset = await this.loadBase64Image(certificateBg, true, 0.82)
            } catch (e) {
                console.warn('Could not load background image:', e)
            }

            try {
                logoAsset = await this.loadBase64Image(logoImg, false)
            } catch (e) {
                console.warn('Could not load logo:', e)
            }

            try {
                leftSigAsset = await this.loadBase64Image(signature1Img, false)
            } catch (e) {
                console.warn('Could not load signature 1:', e)
            }

            try {
                rightSigAsset = await this.loadBase64Image(signature2Img, false)
            } catch (e) {
                console.warn('Could not load signature 2:', e)
            }

            for (const p of this.participants) {
                // 2. Enable stream compression in jsPDF constructor
                const doc = new jsPDF({
                    orientation: 'landscape',
                    unit: 'mm',
                    format: 'a4',
                    compress: true // Enables internal Deflate compression
                })

                const width = doc.internal.pageSize.getWidth() // 297 mm
                const height = doc.internal.pageSize.getHeight() // 210 mm
                const centerX = width / 2

                // ================= 1. COMPRESSED BACKGROUND =================
                if (bgAsset) {
                    // Passing 'FAST' compression alias keeps file size small
                    doc.addImage(bgAsset.data, bgAsset.format, 0, 0, width, height, undefined, 'FAST')
                } else {
                    doc.setFillColor(253, 252, 248)
                    doc.rect(0, 0, width, height, 'F')
                }

                // ================= 2. UPPER-RIGHT LOGO =================
                if (logoAsset) {
                    doc.addImage(logoAsset.data, logoAsset.format, width - 40, 20, 20, 20, undefined, 'FAST')
                }

                // ================= 3. CERTIFICATE TITLE =================
                let currentY = 46
                doc.setFont('times', 'bold')
                doc.setFontSize(26)
                doc.setTextColor(26, 32, 44)
                doc.text('CERTIFICATE OF PARTICIPATION', centerX, currentY, {
                    align: 'center'
                })

                doc.setDrawColor(245, 179, 1)
                doc.setLineWidth(0.8)
                doc.line(centerX - 50, currentY + 3.5, centerX + 50, currentY + 3.5)

                // ================= 4. PRESENTATION LINE =================
                currentY += 18
                doc.setFont('helvetica', 'normal')
                doc.setFontSize(12)
                doc.setTextColor(74, 85, 104)
                doc.text('This is proudly presented to', centerX, currentY, {
                    align: 'center'
                })

                // ================= 5. PARTICIPANT NAME =================
                currentY += 15
                doc.setFont('times', 'bolditalic')
                doc.setFontSize(28)
                doc.setTextColor(238, 107, 18)
                doc.text(p.fullName.toUpperCase(), centerX, currentY, {
                    align: 'center'
                })

                doc.setDrawColor(245, 179, 1)
                doc.setLineWidth(0.6)
                doc.line(centerX - 65, currentY + 3.5, centerX + 65, currentY + 3.5)

                // ================= 6. CITATION & DYNAMIC DETAILS =================
                currentY += 14
                doc.setFont('helvetica', 'normal')
                doc.setFontSize(11)
                doc.setTextColor(74, 85, 104)
                doc.text(
                    'in recognition of their active participation and successful completion of the',
                    centerX,
                    currentY, {
                        align: 'center'
                    }
                )

                currentY += 9
                doc.setFont('helvetica', 'bold')
                doc.setFontSize(14)
                doc.setTextColor(26, 32, 44)
                doc.text('Upskills Team Building Services', centerX, currentY, {
                    align: 'center'
                })

                currentY += 8
                doc.setFont('helvetica', 'normal')
                doc.setFontSize(10.5)
                doc.setTextColor(74, 85, 104)

                const eventDateStr = this.selectedEvent?.eventDate && this.selectedEvent.eventDate !== 'N/A' ?
                    this.selectedEvent.eventDate :
                    moment().format('MMMM DD, YYYY')
                const eventVenueStr = this.selectedEvent?.eventLocation?.trim() || 'Specified Venue'

                const line1 = `Held on ${eventDateStr} at ${eventVenueStr}, organized to foster`
                const line2 = `collaboration, strengthen leadership, and drive organizational excellence.`

                doc.text(line1, centerX, currentY, {
                    align: 'center'
                })
                doc.text(line2, centerX, currentY + 5.5, {
                    align: 'center'
                })

                // ================= 7. DUAL SIGNATURE BLOCKS =================
                const sigLineY = 168
                const leftSigCenterX = 65
                const rightSigCenterX = width - 65

                if (leftSigAsset) {
                    doc.addImage(leftSigAsset.data, leftSigAsset.format, leftSigCenterX - 18, sigLineY - 15, 36, 16, undefined, 'FAST')
                }

                doc.setDrawColor(203, 213, 225)
                doc.setLineWidth(0.5)
                doc.line(leftSigCenterX - 35, sigLineY, leftSigCenterX + 35, sigLineY)

                doc.setFont('helvetica', 'bold')
                doc.setFontSize(10)
                doc.setTextColor(26, 32, 44)
                doc.text('Reb Camancho', leftSigCenterX, sigLineY + 6, {
                    align: 'center'
                })

                doc.setFont('helvetica', 'normal')
                doc.setFontSize(9)
                doc.setTextColor(74, 85, 104)
                doc.text('Facilitator', leftSigCenterX, sigLineY + 11, {
                    align: 'center'
                })

                if (rightSigAsset) {
                    doc.addImage(rightSigAsset.data, rightSigAsset.format, rightSigCenterX - 18, sigLineY - 15, 36, 16, undefined, 'FAST')
                }

                doc.line(rightSigCenterX - 35, sigLineY, rightSigCenterX + 35, sigLineY)

                doc.setFont('helvetica', 'bold')
                doc.setFontSize(10)
                doc.setTextColor(26, 32, 44)
                doc.text('Myrene M. Camingawan', rightSigCenterX, sigLineY + 6, {
                    align: 'center'
                })

                doc.setFont('helvetica', 'normal')
                doc.setFontSize(9)
                doc.setTextColor(74, 85, 104)
                doc.text('Facilitator', rightSigCenterX, sigLineY + 11, {
                    align: 'center'
                })

                const blob = doc.output('blob')
                zip.file(`${p.fullName.replace(/\s+/g, '_')}_Certificate.pdf`, blob)
            }

            // 3. Enable DEFLATE compression with compression level 9 on JSZip
            const zipBlob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 9
                }
            })

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