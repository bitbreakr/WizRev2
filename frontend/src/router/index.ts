import { createMemoryHistory, createRouter } from "vue-router";
import App from "../App.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: App,
    props: false,
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
