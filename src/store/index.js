import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
  
  state: {
    user: JSON.parse(sessionStorage.getItem('user')) || null,
    vote: null,
  },

  mutations: {

    setUser(state, user) {
      state.user = user;
      sessionStorage.setItem('user', JSON.stringify(user));
      Axios.defaults.headers.common['Authorization'] = user ? `Bearer ${user.jwt_token}` : null;
    },

    setVote(state, vote) {
      state.vote = vote;
    }

  },

  actions: {

    signIn({commit}, user) {
      commit('setUser', user);
    },

    signOut({commit}) {
      commit('setUser', null);
    }

  }

})
