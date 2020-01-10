import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import helpers from "./services/helpers";
import "./assets/tailwind.css";
import "vue-scrollama/dist/vue-scrollama.css";
import i18n from "./i18n";

Vue.config.productionTip = false;

new Vue({
	store,
	i18n,
	render: h => h(App)
}).$mount("#app");
