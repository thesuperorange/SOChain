import Vue from 'vue'
import Router from 'vue-router'
import Verify from '@/components/Verify.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/dgpa2/',
  routes: [
    {
      path: '/verify',
      name: 'Verify',
      component: Verify
    }
  ]
})
