<template>
  <div v-if="!loading">
    <b-alert :show="error" variant="danger">{{error}}</b-alert>

    <form v-if="vote !== null" @submit.prevent="onSubmit" @change="onChange" class="my-3">
      <b-card-group deck class="mb-3">
        <EntryCard :data="vote.entries[0]">
          <b-form-group label="Criteria">
            <b-form-radio
              :key="index"
              v-for="(value, index) in criteria"
              v-model="result[index]"
              :value="0"
            >{{value}}</b-form-radio>
          </b-form-group>
          <b-form-group label="Comments">
            <b-form-textarea v-model="comments[0]" rows="5"></b-form-textarea>
          </b-form-group>
        </EntryCard>

        <EntryCard :data="vote.entries[1]">
          <b-form-group label="Criteria">
            <b-form-radio
              :key="index"
              v-for="(value, index) in criteria"
              v-model="result[index]"
              :value="1"
            >{{value}}</b-form-radio>
          </b-form-group>
          <b-form-group label="Comments">
            <b-form-textarea v-model="comments[1]" rows="5"></b-form-textarea>
          </b-form-group>
        </EntryCard>
      </b-card-group>

      <div class="col-md-6 mx-auto">
        <b-button :disabled="!valid" type="submit" variant="primary" block>Submit</b-button>
      </div>
    </form>

    <div v-else>
      <div class="col-md-6 col-sm-8 mx-auto text-center" v-html="content"></div>
      <div class="col-md-4 col-sm-6 mx-auto my-4">
        <b-button @click.prevent="onCreate" variant="primary" block>Start Vote</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import EntryCard from "../../components/EntryCard";
import Config from "../../config";
import Axios from "axios";
import Content from "../../content/Vote.md";

import {
  BButton,
  BCardGroup,
  BFormGroup,
  BFormRadio,
  BFormTextarea
} from "bootstrap-vue";

export default {
  components: {
    BButton,
    BCardGroup,
    BFormGroup,
    BFormRadio,
    BFormTextarea,
    EntryCard
  },

  data() {
    return {
      valid: false,
      error: false,
      loading: true,
      comments: null,
      result: null,
      vote: null,
      criteria: Config.criteria,
      content: Content
    };
  },

  async created() {
    const session = JSON.parse(sessionStorage.getItem("vote")) || {
      comments: ["", ""],
      result: []
    };
    this.comments = session.comments;
    this.result = session.result;
    this.validate();
    try {
      const response = await Axios.get("/api/vote");
      this.vote = response.data.data;
      this.error = null;
    } catch (error) {
      this.vote = null;
    }
    this.loading = false;
  },

  methods: {
    validate() {
      const result = this.result.filter(value => value === 0 || value === 1);
      this.valid = result.length === this.criteria.length;
    },

    saveSession() {
      sessionStorage.setItem(
        "vote",
        JSON.stringify({
          result: this.result,
          comments: this.comments
        })
      );
    },

    onChange() {
      this.validate();
      this.saveSession();
    },

    async onCreate() {
      if (this.vote) {
        return;
      }
      this.loading = true;
      try {
        const response = await Axios.post("/api/vote");
        this.vote = response.data.data;
        this.error = null;
      } catch (error) {
        this.error = Config.messages[error.response.data.error];
      }
      this.loading = false;
    },

    async onSubmit() {
      if (!this.valid) {
        return;
      }
      this.loading = true;
      try {
        await Axios.patch("/api/vote", {
          result: this.result,
          comments: this.comments
        });
        this.vote = null;
        this.result = [];
        this.comments = ["", ""];
        this.error = null;
        this.validate();
        this.saveSession();
      } catch (error) {
        this.error = Config.messages[error.response.data.error];
      }
      this.loading = false;
    }
  }
};
</script>
