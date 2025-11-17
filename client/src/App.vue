<template>
  <div class="app-container d-flex flex-column min-vh-100">
    <nav class="navbar navbar-expand-lg navbar-opaque">
      <div class="collapse navbar-collapse">
        <a class="navbar-brand" href="/home">Pocket Monsters</a>
        <div>
          <ul class="navbar-nav ms-auto">
          </ul>
        </div>
      </div>
      <div class="ms-auto">
        <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/account/register">Sign Up</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/account/login">Sign In</router-link>
            </li>
        </ul>
      </div>
    </nav>

    <main class="flex-grow-1 my-5 d-flex justify-content-center align-items-center" style="min-height: 70vh;">
        <router-view></router-view>
    </main>

    <footer class="text-dark py-2 mt-auto w-100 footer-opaque">
      <div class="text-center">
        <p class="mb-0">© 2025 Pocket Monsters Project.</p>
        <small>Built with Node.js, Express, Vue, Vite</small>
      </div>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
  .app-container {
    background-image: url('/tmpPokemonBg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .navbar-opaque {
    background-color: rgba(255, 255, 255, 0.85);
  }

  .footer-opaque {
    background-color: rgba(255, 255, 255, 0.85);
  }
</style>