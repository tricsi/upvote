<template>
  <div id="app">
    <a :href="url" :disabled="!loading" @click="onLogin">Login</a>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'app',

  data: function() {
    return {
      loading: true,
      url: ''
    };
  },

  async created() {
    const response = await axios.get('/auth' + location.search);
    this.url = response.data.url;
    this.loading = false;
  },

  methods: {
    onLogin() {
    }
  }
}
</script>
