<template>
  <router-link :to="this.to" class="btn btn-sm text-nowrap">
    <span v-if="icon" :class="`fas fa-fw fa-${this.icon}`"></span>
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  name: "NavButton",
  props: ['to', 'icon']
}
</script>
