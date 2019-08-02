<template>
  <div>
    <h1>Votes</h1>
    <b-button
      v-id="!loading"
      @click.prevent="onCreate"
      variant="success"
    >{{vote ? 'Edit' : 'Start'}} Vote</b-button>
  </div>
</template>

<script>
import Axios from 'axios';
import { BButton } from 'bootstrap-vue';
import { mapState, mapMutations } from 'vuex';

export default {
  components: { BButton },

  data() {
    return {
      loading: true
    };
  },

  computed: {
    ...mapState(['vote'])
  },

  methods: {
    ...mapMutations(['setVote']),

    async onCreate() {
      if (!this.vote) {
        const response = await Axios.post('/api/vote');
        this.setVote(response.data.data);
      }
      this.$router.push({name: 'vote', params: {id: 0}});
    }
  },

  async created() {
    if (this.vote) {
      return;
    }
    try {
      const response = await Axios.get('/api/vote');
      this.setVote(response.data.data);
    } catch (error) {
      this.loading = false;
    }
  }
};
</script>

