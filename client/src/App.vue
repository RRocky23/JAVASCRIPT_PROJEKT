<template>
  <div class="app-background">
    <div class="app-phone-frame">
      <div class="app-content d-flex flex-column">
        <nav class="navbar navbar-expand-lg navbar-opaque">
            <div class="ms-auto">
              <ul class="navbar-nav">
                <li v-if="!isLoggedIn" class="nav-item">
                  <router-link class="nav-link" to="/account/register">Sign Up</router-link>
                </li>
                <li v-if="!isLoggedIn" class="nav-item">
                  <router-link class="nav-link" to="/account/login">Sign In</router-link>
                </li>
                <li v-if="isLoggedIn" class="nav-item">
                  <button class="nav-link btn btn-link text-danger" @click="logout">Sign Out</button>
                </li>
              </ul>
            </div>
        </nav>

        <main class="flex-grow-1 my-4 d-flex justify-content-center align-items-center">
          <router-view /> 
        </main>

        <footer class="text-dark py-2 footer-opaque">
          <div class="text-center">
            <p class="mb-0">© 2025 Pocket Monsters Project.</p>
            <small>Built with Node.js, Express, Vue, Vite</small>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from "./composables/useAuth.js";

const { isLoggedIn, logout } = useAuth();

</script>

<style scoped>
@import '../client/src/styles/AppStyles.css'; 
</style>