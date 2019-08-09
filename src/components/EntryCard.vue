<template>
  <b-card :img-src="url(data.image)">
    <b-card-title>
      <b-button :href="url(data.url)" target="blank" variant="primary" size="sm" class="ml-2 float-right">
        PLAY
        <i class="fas fa-external-link-alt" />
      </b-button>
      {{ data.title }}
    </b-card-title>
    <b-card-text v-html="data.description"></b-card-text>
    <b-card-text class="small text-muted">{{data.category.join(', ')}}</b-card-text>
    <div v-if="$slots.default" slot="footer">
      <slot></slot>
    </div>
  </b-card>
</template>

<script>
import { BCard, BCardText, BCardTitle } from "bootstrap-vue";

export default {
  components: { BCard, BCardText, BCardTitle },

  props: ["data"],

  methods: {
    url(value) {
      return value.match(/^https?:\/\//) ? value : `https://js13kgames.com${value}`
    }
  }
};
</script>
