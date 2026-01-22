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
import { onMounted, watch } from 'vue';
import { useAuth } from "./composables/useAuth.js";

const { isLoggedIn, logout } = useAuth();

onMounted(async () => {
  // no global currency fetch here anymore
});

watch(isLoggedIn, async (newValue) => {
  // no global currency logic
});
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

.ms-auto {
  display: none !important;
}

/* MOBILE */
@media (max-width: 1024px) {

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;
    height: 100%;
    overflow: auto;
    background: white !important;
    font-size: 1.28rem !important;
  }

  nav.navbar {
    justify-content: center !important;
  }

  .navbar-brand {
    display: block !important;
    font-size: 2.4rem !important;
    font-weight: 900;
    text-align: center !important;
    width: 100%;
    margin: 0 auto;
    padding: 12px 0;
    color: black !important;
  }

  /* tło mobilne */
  .app-background {
    width: 100vw !important;
    height: 100vh !important;
    background: none !important;
    padding: 0 !important;
    margin: 0 !important;
    display: block !important;
  }

  /* pełny ekran */
  .app-phone-frame {
    width: 100vw !important;
    height: 100vh !important;
    border-radius: 0 !important;
  }

  .app-content {
    height: 100vh !important;
    display: flex;
    font-size: 1.15rem;
    flex-direction: column;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  main {
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    align-items: stretch;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
}

.transition-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.currency-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-radius: 20px;
  margin-left: 16px;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

.currency-icon {
  font-size: 1.2rem;
}

.currency-amount {
  font-weight: 700;
  font-size: 1.1rem;
  color: #333;
  font-family: 'JetBrains Mono', monospace;
}

@media (max-width: 1024px) {
  .currency-display {
    margin: 8px auto;
    padding: 10px 20px;
  }

  .currency-icon {
    font-size: 1.4rem;
  }

  .currency-amount {
    font-size: 1.3rem;
  }
}
</style>

<style>
* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

*::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
</style>

<!-- Mobile accessibility: larger fonts & touch targets globally -->
<style>
@media (max-width: 1024px) {
  /* increase base font so rem-based sizes grow */
  html, body {
    font-size: 1.38rem !important;
  }

  /* enlarge buttons/controls globally */
  button, .btn, input[type="button"], input[type="submit"], .confirm-button {
    font-size: 1.05rem !important;
    padding: 14px 18px !important;
    min-height: 52px !important;
    border-radius: 10px !important;
    touch-action: manipulation;
  }

  /* increase navbar / bottom nav touch targets */
  .bottom-nav .nav-item, .nav-item {
    padding: 12px 18px !important;
    min-width: 72px !important;
  }

  .nav-icon, .home-icon, .action-icon {
    font-size: 2.2rem !important;
  }

  .nav-label, .home-label {
    font-size: 1rem !important;
  }

  /* action cards (home) larger text */
  .action-card h3 {
    font-size: 1.25rem !important;
  }

  .action-card p, .subtitle, .pokemon-name, .small-name {
    font-size: 1.05rem !important;
  }

  /* make modal buttons bigger too */
  .modal-content .btn, .modal-button {
    padding: 14px 20px !important;
    font-size: 1.05rem !important;
  }
}
</style>