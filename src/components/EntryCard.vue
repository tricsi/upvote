<template>
  <b-card :title="data.title">
    <b-card-text>
      {{data.description}}
    </b-card-text>
    <div slot="footer">
      <slot></slot>
    </div>
  </b-card>
</template>

<script>
import { BCard, BCardText } from "bootstrap-vue";

export default {
  components: { BCard, BCardText },
  props: ['data']
};
</script>
