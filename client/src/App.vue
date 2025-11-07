<template>
  <div class="d-flex flex-column min-vh-100">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="collapse navbar-collapse">
        <a class="navbar-brand" href="#">Pocket Monsters</a>
        <div>
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/profile">Profile</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/account">Account</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="flex-grow-1 my-5">
      <router-view></router-view>
    </main>

    <footer class="bg-light text-dark py-4 mt-auto w-100">
      <div class="text-center">
        <p class="mb-0">© 2025 Pocket Monsters Project.</p>
        <small>Built with Node.js, Express, Vue, Vite</small>
      </div>
    </footer>
  </div>
</template>

<script setup>
</script>
