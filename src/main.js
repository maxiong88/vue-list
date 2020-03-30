import Vue from 'vue'
import App from './App.vue'
//import router from './router'
import store from './store'
import mvLoadmore from './components/loadmore.vue'
import mvNextpage from './components/nextpage.vue'
import './sass/base.scss';
Vue.config.productionTip = false
Vue.component('mv-loadmore',mvLoadmore)
Vue.component('mv-nextpage',mvNextpage)
new Vue({
  //router,
  store,
  render: h => h(App)
}).$mount('#app')
