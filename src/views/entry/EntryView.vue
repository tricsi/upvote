<template>
  <div v-if="!loading">

    <div class="row">
      <div class="col-md-6">
        <EntryCard :data="this.entry" class="p-0"></EntryCard>
      </div>
      <div class="col-md-6">
        <b-table-lite :items="criteria" :fields="criteriaFields" striped small>
        </b-table-lite>
        <b-table-lite :items="entry.votes" :fields="battleFields" striped small>
          <template slot="entry.title" slot-scope="data">
            <router-link :to="{name: 'entry', params:{id: data.item.entry.id}}">{{ data.item.entry.title }}</router-link>
          </template>
        </b-table-lite>
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
import Axios from 'axios';
import EntryCard from '../../components/EntryCard';
import { BCard, BCardGroup, BImg, BTableLite } from "bootstrap-vue";
import Config from "../../config";

export default {

  components: { BCard, BCardGroup, BImg, BTableLite, EntryCard },

  props: ['id'],

  data() {
    return {
      loading: true,
      battleFields: {
        title: {
          key: "entry.title",
          label: "Battles"
        },
        score: {
          label: "Result",
          thClass: "text-right",
          tdClass: "text-right"
        },
      },
      criteriaFields: {
        name: {
          label: "Results"
        },
        score: {
          label: "Score",
          thClass: "text-right",
          tdClass: "text-right"
        },
      },
      entry: null,
      criteria: []
    };
  },

  methods: {
    async fetchData() {
      this.loading = true;
      const response = await Axios.get(`/api/entry/${this.id}`);
      const entry = response.data.data;
      this.criteria = Config.criteria.map(criteria => ({
        name: criteria,
        score: 0
      }));
      let sum = 0;
      for (const vote of entry.votes) {
        const score = [0, 0];
        for (let i = 0; i < vote.result.length; i++) {
          const id = vote.result[i];
          if (id === entry.id) {
            this.criteria[i].score++;
            score[0]++;
            sum++;
            continue;
          }
          score[1]++;
        }
        vote.score = score.join(' - ');
      }
      this.criteria.push({
        name: "Total",
        score: sum
      });
      this.entry = entry;
      this.loading = false;
    }
  },

  created() {
    this.fetchData();
  },

  watch: {
    '$route': 'fetchData'
  }

};
</script>
