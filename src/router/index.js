
import { createRouter, createWebHistory } from 'vue-router';
import AdminDashboard from '../views/AdminDashboard.vue';

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
      // Admin Dashboard
      {
        path: '/admin',
        component: AdminDashboard,
        meta: { requiresAuth: true, role: 'admin' },
        children: [
          { path: '', redirect: { name: 'admin-accounts' } },
          {
            path: 'accounts',
            name: 'admin-accounts',
            component: () => import('@/views/admin/AccountManagement.vue')
          },
          {
            path: 'categories',
            name: 'admin-categories',
            component: () => import('@/views/admin/ServiceCategories.vue')
          },
          {
            path: 'jobs',
            name: 'admin-jobs',
            component: () => import('@/views/admin/JobManagement.vue')
          },
          {
            path: 'reviews',
            name: 'admin-reviews',
            component: () => import('@/views/admin/ReviewManagement.vue')
          }
        ]
      },
  ],
});


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
  const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('admin_user'));

  if (to.meta.requiresAuth && !token) {
    if (to.path.startsWith('/admin')) {
      window.location.href = '/admin/login';
    } else {
      window.location.href = '/login';
    }
  } else if (to.meta.role && user?.role !== to.meta.role) {
    alert('You do not have permission to access this page.');
    window.location.href = '/';
  } else {
    next();
  }
});

export default router;
