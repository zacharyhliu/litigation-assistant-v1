// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BaseComponents from '@patsnap/base-components'
import '@patsnap/base-components/lib/base-components-theme/index.css'
import CommonComponents from '@chemical/common-components'
import '@chemical/common-components/lib/theme-chalk/index.css'
import huaci from './directives/huaci'
import App from './App'
import router from './router'
import './assets/recursion-form.less'
import Mock from './mock/mock'

Mock.bootstrap()
Vue.config.productionTip = false
Vue.use(huaci)
Vue.use(BaseComponents)
Vue.use(CommonComponents)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
})
window.Vue = Vue
