<template>
  <div class="app-background">
    <div class="app-phone-frame">
      <div class="app-content d-flex flex-column">

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