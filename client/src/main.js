import { createApp } from "vue";
import { createBootstrap} from "bootstrap-vue-next";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";

import App from "./App.vue";
import router from "./router/router.js";


const app = createApp(App);
app.use(router);
app.use(createBootstrap);
app.mount("#app");