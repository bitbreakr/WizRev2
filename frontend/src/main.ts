import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { store } from "./store";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "fastbootstrap/dist/css/fastbootstrap.min.css";

createApp(App).use(store).use(router).mount("#app");
