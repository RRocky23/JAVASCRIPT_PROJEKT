import { createRouter, createWebHistory } from "vue-router";
import * as tokenService from "../utils/tokenService.js";

import HomePage from "../views/Home.vue";
import ErrorPage from "../views/Error.vue";

import accountRoutes from "./accountRoutes.js";
import profileRoutes from "./profileRoutes.js";
import starterRoutes from "./starterRoutes.js";
import pokedexRoutes from "./pokedexRoutes.js";

const routes = [
  { path: '/', name: 'Root', component: HomePage },
  { path: '/home', name: 'Home', component: HomePage },
  ...accountRoutes,
  ...profileRoutes,
  ...starterRoutes,
  ...pokedexRoutes,
  { path: '/:pathMatch(.*)*', name: 'Error', component: ErrorPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = tokenService.getAccessToken();
  
  if (to.path === '/') {
    if (token) {
      return next({ path: '/home', replace: true });
    }
    return next({ path: '/starter/onboarding1', replace: true });
  }

  if (to.meta.requiresAuth && !token) {
    return next({ path: '/starter/onboarding4', replace: true });
  }

  next();
});

export default router;