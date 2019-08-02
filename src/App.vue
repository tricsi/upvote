<template>

  <Login v-if="!user" />

  <div v-else>

    <nav class="navbar navbar-expand navbar-dark bg-dark static-top">
      <router-link to="/" class="navbar-brand mr-1">BATTLE VOTE</router-link>
      <div class="ml-auto"></div>
      <ul class="navbar-nav ml-auto ml-md-0">
        <li class="nav-item">
          <a href="#" @click.prevent="signOut" class="nav-link" title="Sign Out">
            <i class="fas fa-fw fa-power-off"></i>
          </a>
        </li>
        <li class="nav-item">
          <a :href="`https://github.com/${user.login}`" :title="user.name" target="_blank">
            <b-img :src="user.avatar_url" rounded width="40" height="40" />
          </a>
        </li>
      </ul>
    </nav>

    <div id="wrapper">

      <ul class="sidebar navbar-nav">
        <nav-link to="/vote" icon="file-alt">Votes</nav-link>
      </ul>

      <div id="content-wrapper">
        <transition name="fade" mode="out-in">
          <router-view class="container-fluid"></router-view>
        </transition>
      </div>

    </div>
  </div>

</template>

<script>
import { mapState, mapActions } from 'vuex';
import { BImg } from 'bootstrap-vue';
import Login from './views/admin/Login';
import NavLink from './components/NavLink';

export default {
  name: 'app',
  components: {
    BImg,
    Login,
    NavLink
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    ...mapActions(['signOut'])
  }
}
</script>
