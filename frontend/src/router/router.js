import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";

import accountRoutes from "./accountRoutes.js";
import profileRoutes from "./profileRoutes.js";

const routes = [
  { path: '/', redirect: '/home'},
  { path: '/home', name: "Home", component: Home},
  ...accountRoutes,
  ...profileRoutes,
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;