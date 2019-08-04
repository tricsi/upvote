<template>
  <div v-if="!loading">
    <div class="row">
      <div class="col-md-6">
        <EntryCard :data="this.entry" class="p-0"></EntryCard>
      </div>
      <div class="col-md-6">
        <b-table-lite :items="criteria" :fields="criteriaFields" :striped="true">
        </b-table-lite>
        <b-table-lite :items="entry.votes" :fields="battleFields" :striped="true">
        </b-table-lite>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from 'axios';
import EntryCard from '../../components/EntryCard';
import { BCard, BTableLite } from "bootstrap-vue";
import Config from "../../config";

export default {

  components: { BCard, BTableLite, EntryCard },

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

  async created() {
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
};
</script>
