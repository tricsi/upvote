<template>
  <li class="nav-item">
    <router-link :to="this.to" active-class="active" class="nav-link">
      <i :class="`fas fa-fw fa-${this.icon}`"></i>
      <span class="ml-1"><slot></slot></span>
    </router-link>
  </li>
</template>

<script>
export default {
  name: "NavLink",
  props: {
    to: String,
    icon: String,
  }
}
</script>
