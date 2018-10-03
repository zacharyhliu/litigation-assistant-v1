import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/views/Welcome'
import Preferences from '@/views/Preferences'
import Progress from '@/views/Progress'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome,
    },
    {
      path: '/preferences',
      name: 'Preferences',
      component: Preferences,
    },
    {
      path: '/progress',
      name: 'Progress',
      component: Progress,
    },
  ],
})
