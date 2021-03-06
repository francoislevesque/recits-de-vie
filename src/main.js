import Vue from "vue";
import App from "./App.vue";
import helpers from "./services/helpers"; // IMPORTANT TO KEEP
import "./assets/tailwind.css";
import Switch from "./components/inputs/Switch.vue";
import "vue-scrollama/dist/vue-scrollama.css";
import i18n from "./i18n";
import VueAnalytics from "vue-analytics";

Vue.use(VueAnalytics);

Vue.use(VueAnalytics, {
	id: "UA-129490300-1"
});

Vue.config.productionTip = false;

Vue.component("v-switch", Switch);

new Vue({
	i18n,
	render: h => h(App)
}).$mount("#app");
