<template>
  <div class="text-center m-3">
    <div class="my-4">
      <h1>BattleVote</h1>
      <div>for <a href="http://www.js13kgames.com">js13kgames.com</a></div>
    </div>
    <b-button :href="url" :disabled="loading">Login with GitHub</b-button>
  </div>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';
import { BButton } from 'bootstrap-vue';

export default {
  name: 'Login',
  components: {
    BButton
  },

  data: function() {
    return {
      loading: true,
      url: ''
    };
  },

  methods: {
    ...mapActions(['signIn'])
  },

  async created() {
    let path = '/auth';
    if (location.search) {
      path += location.search;
      window.history.replaceState({}, document.title, location.pathname);
    }
    try {
      const response = await axios.get(path);
      this.loading = false;
      if (response.data.url) {
        this.url = response.data.url;
      } else {
        this.signIn(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

}
</script>
