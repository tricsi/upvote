<template>
  <div>
    <h1>Vote</h1>
    <b-button
      v-if="!loading"
      @click.prevent="onCreate"
      variant="success"
    >Start Vote</b-button>
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
        this.loading = true;
        try {
          const response = await Axios.post('/api/vote');
          this.setVote(response.data.data);
        } catch (error) {
          this.setVote(null);
        }
        this.loading = false;
      }
      this.$router.push({name: 'vote', params: {id: 0}});
    }
  },

  async created() {
    if (!this.vote) {
      try {
        const response = await Axios.get('/api/vote');
        this.setVote(response.data.data);
      } catch (error) {
        this.setVote(null);
      }
    }
    this.loading = false;
  }
};
</script>

