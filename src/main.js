import Vue from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import Switch from "./components/inputs/Switch.vue";
import "./assets/tailwind.css";
import "vue-scrollama/dist/vue-scrollama.css";

Vue.config.productionTip = false;

Vue.component("v-switch", Switch);

new Vue({
	i18n,
	render: h => h(App)
}).$mount("#app");
