<template>
  <Login v-if="!user" />

  <div v-else>
    <nav class="navbar navbar-expand navbar-dark bg-dark static-top">
      <div class="container">
        <router-link to="/" class="navbar-brand mr-1">Upvote</router-link>
        <ul class="navbar-nav ml-5">
          <li class="nav-item">
            <router-link :to="{name: 'entries'}" active-class="active" class="nav-link">
              <i class="fas fa-fw fa-poll"></i>
              <span class="ml-1">Results</span>
            </router-link>
          </li>
        </ul>
        <b-dropdown right>
          <template slot="button-content">
            <b-img :src="user.avatar_url" rounded width="36" height="36" />
          </template>
          <b-dropdown-item :href="`https://github.com/${user.login}`" target="_blank">
            <i class="fab fa-fw fa-github" />
            {{user.login}}
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
import { mapState, mapActions } from "vuex";
import { BDropdown, BDropdownItem, BImg } from "bootstrap-vue";
import Login from "./views/admin/Login";

export default {
  name: "app",
  components: { BDropdown, BDropdownItem, BImg, Login },
  computed: {
    ...mapState(["user"])
  },
  methods: {
    ...mapActions(["signOut"])
  }
};
</script>
