import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../views/Home.vue";
import ErrorPage from "../views/Error.vue";

import accountRoutes from "./accountRoutes.js";
import profileRoutes from "./profileRoutes.js";

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'Home', component: HomePage },
  ...accountRoutes,
  ...profileRoutes,
  { path: '/:pathMatch(.*)*', name: 'Error', component: ErrorPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;