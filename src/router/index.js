
import { createRouter, createWebHistory } from 'vue-router';

const ResidentDashboard = () => import('@/views/ResidentDashboard.vue');
const TradieDashboard = () => import('@/views/TradieDashboard.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    // Resident Dashboard
    {
      path: '/dashboard',
      component: ResidentDashboard,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: { name: 'resident-profile' } },
        { path: 'profile', name: 'resident-profile', component: () => import('@/views/resident/MyProfile.vue') },
        { path: 'quotes', name: 'resident-quotes', component: () => import('@/views/resident/MyQuoteRequests.vue') },
        { path: 'jobs', name: 'resident-jobs', component: () => import('@/views/resident/MyJobs.vue') },
      ]
    },
    // Tradie Dashboard
    {
      path: '/tradie-dashboard',
      component: TradieDashboard,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: { name: 'tradie-quotes' } },
        {
          path: 'profile',
          name: 'tradie-profile',
          component: () => import('@/views/tradie/MyProfile.vue')
        },
        {
          path: 'quotes',
          name: 'tradie-quotes',
          component: () => import('@/views/tradie/MyQuoteRequests.vue')
        },
        {
          path: 'jobs',
          name: 'tradie-jobs',
          component: () => import('@/views/tradie/MyJobs.vue')
        }
      ]
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    window.location.href = '/login';
  } else {
    next();
  }
});

export default router;
