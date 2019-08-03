<template>
  <div v-if="!loading" class="card card-login mx-auto mt-5">
    <div class="card-header text-center">BattleVote</div>
    <div class="card-body">
      <b-alert :show="error" variant="danger" dismissible>Access denied!</b-alert>
      <b-button :href="url" variant="primary" block>Sign in with <i class="fab fa-fw fa-github" /> GitHub</b-button>
    </div>
  </div>
</template>

<script>
import Axios from 'axios';
import { mapActions } from 'vuex';
import { BAlert, BButton } from 'bootstrap-vue';

export default {
  name: 'Login',
  components: { BAlert, BButton },

  data: function() {
    return {
      error: false,
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
    }
    try {
      const response = await Axios.get(path);
      if (response.data.url) {
        this.url = response.data.url;
      } else {
        this.signIn(response.data);
        this.$router.push('/');
      }
    } catch (error) {
      this.error = true;
    }
    this.loading = false;
  }

}
</script>
