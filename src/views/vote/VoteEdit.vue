<template>

  <div v-if="loading">
    <div class="d-flex justify-content-center">
      <b-spinner label="Loading..."></b-spinner>
    </div>
  </div>

  <div v-else>

    <b-alert :show="error" variant="danger">{{ error }}</b-alert>

    <div v-if="vote === null">
      <div v-html="content" class="col-md-6 col-sm-8 mx-auto text-center"></div>
      <div class="col-md-4 col-sm-6 mx-auto my-4">
        <b-alert :show="voted" variant="success" class="text-center">Vote added successfully!</b-alert>
        <b-button @click.prevent="onCreate" variant="primary" block>Start New Vote</b-button>
      </div>
      <hr>
      <Statistics />
    </div>

    <form v-else @submit.prevent="onSubmit" @change="onChange" class="my-3">
      <b-card-group class="mb-3">
        <EntryCard :data="vote.entries[0]">
          <b-form-group label="Comments">
            <b-form-textarea v-model="comments[0]" rows="5"></b-form-textarea>
          </b-form-group>
        </EntryCard>

        <b-card class="text-center" body-class="d-flex justify-content-center align-items-center">
          <h1>OR</h1>
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
        <TimeButton
          v-if="!id"
          type="submit"
          class="btn btn-primary btn-block"
          :available="vote.availableAt"
          >Submit</TimeButton>
        <div class="d-flex" v-else>
          <b-button variant="primary" :to="{ name: 'vote', params:{ id: parseInt(id) - 1}}">&lt;prev</b-button>
          <b-button variant="primary" type="submit" class="btn-block mx-1">switch</b-button>
          <b-button variant="primary" :to="{ name: 'vote', params:{ id: parseInt(id) + 1}}">next&gt;</b-button>
        </div>
      </div>
    </form>
  </div>

</template>

<script>
import EntryCard from "../../components/EntryCard";
import TimeButton from "../../components/TimeButton";
import Statistics from "../../components/Statistics";
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
    EntryCard,
    TimeButton,
    Statistics
  },

  props: ["id"],

  data() {
    return {
      error: false,
      loading: true,
      voted: false,
      comments: null,
      result: null,
      vote: null,
      criteria: Config.criteria,
      content: Content
    };
  },
  
  methods: {

    async fetchData() {
      const session = JSON.parse(sessionStorage.getItem("vote")) || {
        comments: ["", ""],
        result: new Array(this.criteria.length).fill(0)
      };
      this.comments = session.comments;
      this.result = session.result;
      try {
        const response = await Axios.get(`/api/vote/${this.id}`);
        this.vote = response.data.data;
        this.onLoad();
        this.error = null;
      } catch (error) {
        if (error.response.status === 401) {
          this.$router.replace("/entries");
        }
        this.vote = null;
      }
      this.loading = false;
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

    onLoad() {
      const entries = this.vote.entries;
      if (this.vote.result) {
        this.result = this.vote.result.map(id => {
          if (id === entries[0].id) return -1;
          if (id === entries[1].id) return 1;
          return 0;
        });
      }
      if (this.vote.comments) {
        for (const comment of this.vote.comments) {
          if (comment.id === entries[0].id) {
            this.comments[0] = comment.message;
          }
          if (comment.id === entries[1].id) {
            this.comments[1] = comment.message;
          }
        }
      }
    },

    onChange() {
      this.saveSession();
    },

    async onCreate() {
      if (this.vote) {
        return;
      }
      this.loading = true;
      this.voted = false;
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
        const response = await Axios.patch(`/api/vote/${this.id}`, {
          result: this.result,
          comments: this.comments
        });
        if (this.id) {
          this.vote = response.data.data;
          this.onLoad();
        } else {
          this.vote = null;
          this.result = new Array(this.criteria.length).fill(0);
          this.comments = ["", ""];
          this.error = null;
          this.voted = true;
          this.saveSession();
        }
      } catch (error) {
        this.error = Config.messages[error.response.data.error];
      }
      this.loading = false;
    }
  },

  created() {
    this.fetchData();
  },

  watch: {
    $route: "fetchData"
  }

};
</script>
