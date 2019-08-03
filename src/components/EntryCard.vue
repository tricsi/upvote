<template>
  <b-card :title="data.title">
    <b-card-text v-html="nl2br(data.description)"></b-card-text>
    <div slot="footer">
      <slot></slot>
    </div>
  </b-card>
</template>

<script>
import { BCard, BCardText } from "bootstrap-vue";

export default {
  components: { BCard, BCardText },

  props: ['data'],

  methods: {
    nl2br(value) {
      return value.replace(/[\r\n]+/, '<br>');
    }
  }
};
</script>
