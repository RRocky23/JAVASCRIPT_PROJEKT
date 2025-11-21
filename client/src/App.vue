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
              <li class="nav-item">
                <router-link class="nav-link" to="/account/register">Sign Up</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/account/login">Sign In</router-link>
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
@media (max-width: 1024px), (pointer: coarse) {
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  .app-background {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none !important;
  }

  .app-phone-frame {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    box-shadow: none;
    background: white;

    display: flex;
    flex-direction: column;
  }

  .app-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  nav.navbar {
    flex: 0 0 auto;
  }

  main {
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  footer {
    flex: 0 0 auto;
  }
}

</style>