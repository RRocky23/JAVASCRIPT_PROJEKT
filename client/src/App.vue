<template>
  <div class="app-background">
    <div class="app-phone-frame">
      <div class="app-content d-flex flex-column">
        <nav class="navbar navbar-expand-lg navbar-opaque">
          <div class="collapse navbar-collapse">
            <a class="navbar-brand" href="/home">Pocket Monsters</a>
          </div>
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
          <router-view></router-view>
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
/* DESKTOP */
.app-background {
  width: 100vw;
  height: 100vh;
  background-image: url('/tmpPokemonBg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  display: flex;
  justify-content: center;
  align-items: center;
}

.app-phone-frame {
  width: 430px;
  height: 90vh;
  background: white;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
}

/* MOBILE */
@media (max-width: 1024px) {
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: white !important;
  }

  .app-background {
    width: 100vw !important;
    height: 100vh !important;
    background: none !important;
    padding: 0 !important;
    margin: 0 !important;
    display: block !important; /* najważniejsze: usuwa centrowanie */
  }

  .app-phone-frame {
    width: 100vw !important;
    height: 100vh !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    background: white !important;
  }

  .app-content {
    height: 100vh !important;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

</style>