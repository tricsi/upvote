<template>
  <div v-if="!loading" class="card card-login mx-auto mt-5">
    <div class="card-header">Battle Vote</div>
    <div class="card-body">
      <b-button :href="url" variant="primary" block>Sign in with GitHub</b-button>
    </div>
  </div>
</template>

<script>
import Axios from 'axios';
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
      const response = await Axios.get(path);
      this.loading = false;
      if (response.data.url) {
        this.url = response.data.url;
      } else {
        this.signIn(response.data);
      }
    } catch (error) {
    }
  }

}
</script>
