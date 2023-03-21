import {createApp} from "vue";

import App from '@/App';
import store from '@/store';

createApp(App)
.use(store)
.mount('#app');
// получим csrf токен
store.commit('setCsrf');

import './assets/css/bootstrap5.min.css';