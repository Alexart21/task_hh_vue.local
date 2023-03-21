import { createStore } from "vuex";

const store = {
  state: {
    scrf: ''
  },
  getters: {
    csrf: (state) => state.csrf
  },
  mutations: {
    setCsrf(state) {
      state.csrf = document.getElementById("_csrf_token").content;
    },
  },
  actions: {
    
  },
  strict: process.env.NODE_ENV !== "production",
};
export default createStore(store);
