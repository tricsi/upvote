<template>
  <Login v-if="!user" />

  <div v-else>
    <nav class="navbar navbar-expand navbar-dark bg-dark static-top">
      <div class="container">
        <router-link to="/" class="navbar-brand mr-1">
          <img :src="logo" alt="js13kgames.com" />
        </router-link>
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

<style lang="css">
.navbar-brand > img {
  max-height: 50px;
}
input[type=range] {
  -webkit-appearance: none;
  margin: 18px 0;
  width: 100%;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-moz-range-track {
  width: 100%;
  height: 10px;
  cursor: pointer;
  background: #37a;
  border-radius: 3px;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 10px;
  cursor: pointer;
  background: #37a;
  border-radius: 3px;
}
input[type=range]::-moz-range-thumb {
  border: 1px solid #000;
  height: 36px;
  width: 16px;
  background: #fff;
  border-radius: 3px;
  cursor: pointer;
}
input[type=range]::-webkit-slider-thumb {
  border: 1px solid #000;
  height: 36px;
  width: 16px;
  background: #fff;
  border-radius: 3px;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -14px;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #37a;
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import { BDropdown, BDropdownItem, BImg } from "bootstrap-vue";
import Login from "./views/admin/Login";
import Logo from "./assets/logo.png";

export default {
  name: "app",
  components: { BDropdown, BDropdownItem, BImg, Login },
  data() {
    return {
      logo: Logo
    };
  },
  computed: {
    ...mapState(["user"])
  },
  methods: {
    ...mapActions(["signOut"])
  }
};
</script>
