<template>
  <div>

    <b-table
      :items="items"
      :fields="fields"
      :striped="true"
      sort-by="score"
      :sort-desc="true">
    </b-table>
  </div>
</template>

<script>
import Axios from 'axios';

export default {
  data() {
    return {
      loading: true,
      items: null,
      length: 9999,
      fields: {
        title: {
          key: 'data.title',
          label: 'Game',
        },
        round: {
          label: 'Round',
          sortable: true,
          thStyle: {width: "100px"},
          tdClass: 'text-center'
        },
        score: {
          label: 'Score',
          sortable: true,
          thStyle: {width: "100px"},
          tdClass: 'text-center'
        },
      }
    };
  },
  async created() {
    const response = await Axios.get('/api/entry');
    this.items = response.data;
  }
};
</script>
