<template>
  <div v-if="!loading" class="container">
    <div class="col-lg-8 mx-auto my-4 text-center" v-html="content"></div>
    <div class="col-md-4 col-sm-6 mx-auto">
      <b-alert :show="error" variant="danger" dismissible>Access denied!</b-alert>
      <b-button :href="url" variant="primary" block>
        Sign in with
        <i class="fab fa-fw fa-github" /> GitHub
      </b-button>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import { mapActions } from "vuex";
import { BAlert, BButton } from "bootstrap-vue";
import Readme from "../../content/Login.md";

export default {
  name: "Login",
  components: { BAlert, BButton },

  data: function() {
    return {
      error: false,
      loading: true,
      content: Readme,
      url: ""
    };
  },

  methods: {
    ...mapActions(["signIn"])
  },

  async created() {
    let path = "/auth";
    if (location.search) {
      path += location.search;
    }
    try {
      const response = await Axios.get(path);
      if (response.data.url) {
        this.url = response.data.url;
      } else {
        this.signIn(response.data);
      }
    } catch (error) {
      this.error = true;
    }
    this.$router.replace("/");
    this.loading = false;
  }
};
</script>
