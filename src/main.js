import Vue from 'vue';
import App from './App.vue';
import Axios from 'axios';
import store from './store';
import router from './router';
import BootstrapVue from 'bootstrap-vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'startbootstrap-sb-admin/css/sb-admin.css';
import 'startbootstrap-sb-admin/vendor/fontawesome-free/css/all.css';
import 'startbootstrap-sb-admin/vendor/fontawesome-free/webfonts/fa-regular-400.svg';

Axios.defaults.baseURL = 'http://localhost:3000/';
Axios.defaults.headers.common['Authorization'] = store.state.user
  ? `Bearer ${store.state.user.jwt_token}`
  : null;

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

router.beforeEach((to, from, next) => {
  if (store.state.user) {
    next();
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
