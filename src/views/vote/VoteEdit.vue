<template>
  <div v-if="loading">
    <div class="d-flex justify-content-center">
      <b-spinner label="Loading..."></b-spinner>
    </div>
  </div>
  <div v-else>
    <b-alert :show="error" variant="danger">{{error}}</b-alert>

    <form v-if="vote !== null" @submit.prevent="onSubmit" @change="onChange" class="my-3">
      <b-card-group class="mb-3">
        <EntryCard :data="vote.entries[0]">
          <b-form-group label="Comments">
            <b-form-textarea v-model="comments[0]" rows="5"></b-form-textarea>
          </b-form-group>
        </EntryCard>

        <b-card class="text-center" body-class="d-flex justify-content-center align-items-center">
          <h1>VS</h1>
          <div slot="footer">
            <div :key="index" v-for="(value, index) in criteria" class="py-2">
              <h6>{{ value }}</h6>
              <input type="range" v-model.number="result[index]" value="0" min="-1" max="1" step="1" />
            </div>
          </div>
        </b-card>

        <EntryCard :data="vote.entries[1]">
          <b-form-group label="Comments">
            <b-form-textarea v-model="comments[1]" rows="5"></b-form-textarea>
          </b-form-group>
        </EntryCard>
      </b-card-group>

      <div class="col-md-4 col-sm-6 mx-auto my-4">
        <b-button type="submit" variant="primary" block>Submit</b-button>
      </div>
    </form>

    <div v-else>
      <div v-html="content" class="col-md-6 col-sm-8 mx-auto text-center"></div>
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
  BCard,
  BCardGroup,
  BFormGroup,
  BFormTextarea
} from "bootstrap-vue";

export default {
  components: {
    BButton,
    BCard,
    BCardGroup,
    BFormGroup,
    BFormTextarea,
    EntryCard
  },

  data() {
    return {
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
      result: new Array(this.criteria.length).fill(0)
    };
    this.comments = session.comments;
    this.result = session.result;
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
      this.loading = true;
      try {
        await Axios.patch("/api/vote", {
          result: this.result,
          comments: this.comments
        });
        this.vote = null;
        this.result = new Array(this.criteria.length).fill(0);
        this.comments = ["", ""];
        this.error = null;
        this.saveSession();
      } catch (error) {
        this.error = Config.messages[error.response.data.error];
      }
      this.loading = false;
    }
  }
};
</script>
