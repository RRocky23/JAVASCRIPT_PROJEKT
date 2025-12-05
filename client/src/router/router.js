import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../views/Home.vue";
import ErrorPage from "../views/Error.vue";

import accountRoutes from "./accountRoutes.js";
import profileRoutes from "./profileRoutes.js";
import starterRoutes from "./starterRoutes.js";

const routes = [
  { path: '/', redirect: '/starter/onboarding1' },
  { path: '/home', name: 'Home', component: HomePage },
  ...accountRoutes,
  ...profileRoutes,
  ...starterRoutes,
  { path: '/:pathMatch(.*)*', name: 'Error', component: ErrorPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;