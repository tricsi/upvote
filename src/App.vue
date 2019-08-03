<template>

  <Login v-if="!user" />

  <div v-else>

    <nav class="navbar navbar-expand navbar-dark bg-dark static-top">
      <div class="container">
        <router-link to="/" class="navbar-brand mr-1">BattleVote</router-link>
        <ul class="navbar-nav ml-5">
          <nav-link to="/entries" icon="gamepad">Entries</nav-link>
        </ul>
        <b-dropdown right>
          <template slot="button-content">
            <b-img :src="user.avatar_url" rounded width="36" height="36" />
          </template>
          <b-dropdown-item :href="`https://github.com/${user.login}`" target="_blank">
            <i class="fab fa-fw fa-github" /> {{user.login}}
          </b-dropdown-item>
          <b-dropdown-item href="#" @click.prevent="signOut">
            <i class="fas fa-fw fa-power-off" /> Sign Out
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </nav>

    <main class="container py-3" role="main">
      <router-view></router-view>
    </main>

  </div>

</template>

<script>
import { mapState, mapActions } from 'vuex';
import { BDropdown, BDropdownItem, BImg } from 'bootstrap-vue';
import Login from './views/admin/Login';
import NavLink from './components/NavLink';

export default {
  name: 'app',
  components: { BDropdown, BDropdownItem, BImg, Login, NavLink },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    ...mapActions(['signOut'])
  }
}
</script>
