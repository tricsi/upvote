<template>

  <div v-if="loading">
    <div class="d-flex justify-content-center">
      <b-spinner label="Loading entries..."></b-spinner>
    </div>
  </div>

  <div v-else>
    <b-form inline class="d-flex">
      <b-form-input v-model="search" placeholder="Search" class="flex-grow-1 mr-md-2 mb-3" />
      <b-form-select v-model="category" :options="categories" class="mb-3">
        <option slot="first" :value="null">All Category</option>
      </b-form-select>
    </b-form>
    <b-table :items="items" :fields="fields" :filter-function="filterTable" filter="true" striped responsive>
      <template slot="rank" slot-scope="data">{{ data.item.rank || '' }}</template>
      <template slot="title" slot-scope="data">
        <router-link :to="{name: 'entry', params:{id: data.item.id}}">{{ data.item.title }}</router-link>
      </template>
    </b-table>
  </div>

</template>

<script>
import Axios from "axios";
import {
  BForm,
  BFormInput,
  BFormSelect
} from "bootstrap-vue";
import Config from "../../config";

export default {

  components: {
    BForm,
    BFormInput,
    BFormSelect
  },

  data() {
    return {
      loading: true,
      items: null,
      length: 9999,
      search: "",
      category: null,
      categories: Config.categories,
      fields: {
        rank: {
          label: "#",
          tdClass: "text-right",
          thClass: "text-right",
          thStyle: "width: 1%"
        },
        title: {
          label: "Game"
        },
        votes: {
          key: "votes.length",
          label: "Votes",
          tdClass: "text-center",
          thStyle: "width: 1%"
        },
        win: {
          label: "Win",
          tdClass: "text-center",
          thStyle: "width: 1%"
        },
        lose: {
          label: "Lose",
          tdClass: "text-center",
          thStyle: "width: 1%"
        },
        score: {
          label: "Score",
          tdClass: "text-center",
          thStyle: "width: 1%"
        },
        tie: {
          label: "TBS",
          headerTitle: "Tie Break Score",
          tdClass: "text-center",
          thStyle: "width: 1%"
        }
      }
    };
  },

  async created() {
    const response = await Axios.get("/api/entry");
    const data = response.data;
    this.computeTies(data);
    this.sortByScore(data);
    this.computeRank(data);
    this.items = data;
    this.loading = false;
  },

  methods: {

    filterTable(item) {
      let result = true;
      if (this.search) {
        result = item.title.toLowerCase().includes(this.search.toLowerCase());
      }
      if (result && this.category) {
        result = item.category.includes(this.category);
      }
      return result;
    },

    computeTies(data) {
      for (const item1 of data) {
        item1.tie = 0;
        for (const item2 of data) {
          if (
            item1.id !== item2.id &&
            item1.votes.filter(vote => item2.votes.includes(vote)).length
          ) {
            item1.tie = item2.score;
          }
        }
      }
    },

    sortByScore(data) {
      data.sort((a, b) => {
        let result = b.score - a.score;
        if (!result) {
          result = b.tie - a.tie;
        }
        return result;
      });
    },

    computeRank(data) {
      let rank = 1;
      data[0].rank = data[0].votes.length ? rank : 0;
      for (let i = 1; i < data.length; i++) {
        const item1 = data[i - 1];
        const item2 = data[i];
        if (item1.score > item2.score || item1.tie > item2.tie) {
          rank = i + 1;
        }
        item2.rank = item2.votes.length ? rank : 0;
      }
    }
  }
};
</script>
