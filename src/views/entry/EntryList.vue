<template>
  <div v-if="!loading">
    <b-table :items="items" :fields="fields" :striped="true">
      <template slot="title" slot-scope="data">
        <span :id="`#game${data.item.id}`">#{{ data.item.rank }} </span>
        <a :href="`#game${data.item.id}`">{{ data.item.title }}</a>
      </template>
    </b-table>
  </div>
</template>

<script>
import Axios from "axios";

export default {

  data() {
    return {
      loading: true,
      items: null,
      length: 9999,
      fields: {
        title: {
          label: "Game"
        },
        round: {
          label: "Round",
          tdClass: "text-center"
        },
        win: {
          label: "Win",
          tdClass: "text-center"
        },
        lose: {
          label: "Lose",
          tdClass: "text-center"
        },
        score: {
          label: "Score",
          tdClass: "text-center"
        },
        tie: {
          label: "Tie",
          tdClass: "text-center"
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
      data[0].rank = data[0].round ? rank : 0;
      for (let i = 1; i < data.length; i++) {
        const item1 = data[i - 1];
        const item2 = data[i];
        if (item1.score > item2.score || item1.tie > item2.tie) {
          rank = i + 1;
        }
        item2.rank = item2.round ? rank : 0;
      }
    }

  }

};
</script>
