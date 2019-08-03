import Vue from 'vue';
import Router from 'vue-router';
import Error from './views/admin/Error';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {path: '/', name: 'votes', component: () => import('./views/vote/VoteEdit.vue')},
    {path: '/entries', name: 'entries', component: () => import('./views/entry/EntryList.vue')},
    {path: '*', component: Error, props: {code: '404', message: 'Page Not Found'}}
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0};
  }
});
