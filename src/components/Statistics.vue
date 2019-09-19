<template>
  <div v-if="loading">
    <div class="d-flex justify-content-center">
      <b-spinner label="Loading Statistics..."></b-spinner>
    </div>
  </div>

  <div v-else-if="data" class="d-flex flex-column justify-content-center text-center">
    <h4>Your progress</h4>
    <p>You have voted for {{this.data.votedEntries}} entries out of {{this.data.totalEntries}}</p>
    <b-progress :value="this.data.votedEntries" :max="this.data.totalEntries" striped></b-progress>
  </div>
</template>

<script>
import Config from "../config";
import Axios from "axios";

export default {

  data() {
    return {
      data: null,
      loading: false,
      error: null
    };
  },

  created() {
    this.load();
  },

  methods: {
    async load() {
      this.error = null;
      this.loading = true;
      try {
        const response = await Axios.get("/api/stats");
        this.data = response.data.data;
      } catch (error) {
        this.error = Config.messages[error.response.data.error];
      }
      this.loading = false;
    }
  }
}
</script>
