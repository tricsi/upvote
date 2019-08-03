<template>
  <b-card :img-src="data.images.image_large">
    <b-card-title>
      <b-button :href="data.url" target="blank" variant="primary" size="sm" class="ml-2 float-right">
        PLAY <i class="fas fa-external-link-alt" />
      </b-button>
      {{ data.title }}
    </b-card-title>
    <b-card-text v-html="nl2br(data.description)"></b-card-text>
    <b-card-text class="small text-muted">{{data.category.join(', ')}}</b-card-text>
    <div slot="footer">
      <slot></slot>
    </div>
  </b-card>
</template>

<script>
import { BCard, BCardText, BCardTitle } from "bootstrap-vue";

export default {
  components: { BCard, BCardText, BCardTitle },

  props: ['data'],

  methods: {
    nl2br(value) {
      return value.replace(/[\r\n]+/, '<br>');
    }
  }
};
</script>
