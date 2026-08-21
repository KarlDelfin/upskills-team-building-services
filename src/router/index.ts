import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/privacy-policy',
      name: 'Privacy Policy',
      component: () => import('../views/PrivacyPolicyView.vue'),
      meta: { title: 'Privacy Policy' }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/AdminView.vue'),
      children: [
        {
          path: 'booking',
          name: 'Bookings',
          component: () => import('../views/BookingView.vue'),
          meta: { title: 'Bookings' }
        },
        {
          path: 'status',
          name: 'Status',
          component: () => import('../views/StatusView.vue'),
          meta: { title: 'Status' }
        },
        {
          path: 'timeslot',
          name: 'Time Slot',
          component: () => import('../views/TimeSlotView.vue'),
          meta: { title: 'Time Slot' }
        },
        {
          path: 'services',
          name: 'Services',
          component: () => import('../views/ServiceView.vue'),
          meta: { title: 'Service' }
        },
        {
          path: 'calendar',
          name: 'Calendar',
          component: () => import('../views/CalendarView.vue'),
          meta: { title: 'Calendar' }
        },
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404 Not Found',
      component: () => import('../components/NotFound.vue'),
      meta: { title: '404 Not Found' }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const companyName = 'Upskills Team Building Services'

  if (to.name === 'Home') {
    document.title = companyName
  } else {
    const baseTitle = to.meta.title || companyName
    document.title = `${baseTitle} | ${companyName}`
  }
  
  next()
})


export default router