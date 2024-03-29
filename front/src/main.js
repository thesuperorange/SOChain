// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//bootstrap scss

import 'bootstrap/dist/css/bootstrap.css'
import './assets/stylesheets/_bootstrap.scss'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap'
import './assets/paper-dashboard.scss'
//modal
import VModal from 'vue-js-modal'
 
Vue.use(VModal)
Vue.use(BootstrapVue);


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
