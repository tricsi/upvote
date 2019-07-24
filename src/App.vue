<template>
  <div id="app">
    <b-container>
      <Login v-if="!user" />
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { BContainer } from 'bootstrap-vue';
import Login from './components/Login';

export default {
  name: 'app',
  components: {
    Login,
    BContainer
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>
