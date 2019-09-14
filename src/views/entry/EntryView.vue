<template>
  <div v-if="loading">
    <div class="d-flex justify-content-center">
      <b-spinner label="Loading entry..."></b-spinner>
    </div>
  </div>
  <div v-else>
    <div class="row">
      <div class="col-md-6">
        <EntryCard :data="this.entry" class="p-0"></EntryCard>
      </div>
      <div class="col-md-6">
        <b-table-lite :items="entry.criteria" :fields="fields" striped small></b-table-lite> 
      </div>
    </div>

    <div class="my-3">
      <b-card :key="index" v-for="(comment, index) in entry.comments">
        <b-card-text>{{ comment.message }}</b-card-text>
        <div slot="footer">
          <i class="float-right">{{ new Intl.DateTimeFormat('en-US').format(new Date(comment.createdAt)) }}</i>
          <b-img :src="`https://github.com/${comment.login}.png?size=26`" :alt="comment.login" rounded />
          <a :href="`https://github.com/${comment.login}`" class="ml-1">{{ comment.login }}</a>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import EntryCard from "../../components/EntryCard";
import { BCard, BImg, BTableLite } from "bootstrap-vue";

export default {
  components: { BCard, BImg, BTableLite, EntryCard },

  props: ["id"],

  data() {
    return {
      loading: true,
      fields: [
        {
          key: "name",
          label: "Results"
        },
        {
          key: "score",
          label: "Score",
          thClass: "text-right",
          tdClass: "text-right"
        }
      ],
      entry: null
    };
  },

  methods: {
    async fetchData() {
      try {
        this.loading = true;
        const response = await Axios.get(`/api/entry/${this.id}`);
        const entry = response.data.data;
        entry.criteria.push({
          name: "Total",
          score: entry.score
        });
        this.entry = entry;
        this.loading = false;
      } catch (error) {
        this.$router.replace("/entries");
      }
    }
  },

  created() {
    this.fetchData();
  },

  watch: {
    $route: "fetchData"
  }
};
</script>
