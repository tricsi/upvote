<template>
  <div v-if="!loading">
    <h1 class="text-center">Vote</h1>

    <b-alert :show="error" variant="danger">{{error}}</b-alert>

    <form v-if="vote" @submit.prevent="onSubmit" @change="onChange" class="my-3">

      <b-card-group deck class="mb-3">
        <EntryCard :data="vote.entries[0]">
          <b-form-group label="Votes">
            <b-form-radio
              :key="index"
              v-for="(criteria, index) in criterias"
              v-model="result[index]"
              :value="0"
            >{{criteria}}</b-form-radio>
          </b-form-group>
          <b-form-group label="Comments">
            <b-form-textarea v-model="comments[0]" rows="5"></b-form-textarea>
          </b-form-group>
        </EntryCard>

        <EntryCard :data="vote.entries[1]">
          <b-form-group label="Votes">
            <b-form-radio
              :key="index"
              v-for="(criteria, index) in criterias"
              v-model="result[index]"
              :value="1"
            >{{criteria}}</b-form-radio>
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
      <div class="col-md-6 mx-auto">
        <b-button @click.prevent="onStart" variant="success" block>Start Vote</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import EntryCard from "../../components/EntryCard";
import Axios from "axios";
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
      comments: [],
      result: [],
      vote: null,
      criterias: [
        "Theme use",
        "Gameplay",
        "Innovation",
        "Controls",
        "Execution"
      ]
    };
  },

  methods: {

    onChange() {
      const result = this.result.filter(value => value === 0 || value === 1);
      this.valid = result.length === this.criterias.length;
      sessionStorage.setItem('vote', JSON.stringify({
        result: this.result,
        comments: this.comments
      }));
    },

    async onStart() {
      if (this.vote) {
        return;
      }
      this.loading = true;
      try {
        const response = await Axios.post("/api/vote");
        this.vote = response.data.data;
        this.error = null;
      } catch (error) {
        this.error = error.response.data.error;
      }
      this.loading = false;
    },

    async onSubmit() {
      if (!this.valid) {
        return;
      }
      this.loading = true;
      try {
        await Axios.patch('/api/vote', { result: this.result });
        this.vote = null;
        this.result = [];
        this.comments = [];
        this.error = null;
      } catch (error) {
        this.error = error.response.data.error;
      }
      this.loading = false;
    }
  },

  async created() {
    if (!this.vote) {
      try {
        const session = JSON.parse(sessionStorage.getItem('vote')) || null
        const response = await Axios.get("/api/vote");
        this.vote = response.data.data;
        this.result = session.result || [];
        this.comments = session.comments || [];
        this.error = null;
      } catch (error) {
        this.vote = null;
      }
    }
    this.loading = false;
  }
};
</script>
