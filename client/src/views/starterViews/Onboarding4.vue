<template>
  <div class="welcome-wrapper">
    <div class="welcome-container">
      
      <!-- Obrazek z pikselową grafiką -->
      <img class="welcome-image" src="/onboarding-adventure.png" alt="Adventure">

      <!-- Teksty -->
      <h2 class="title">Ready for a real<br>
                        adventure? Lets go!</h2>

      <!-- Przyciski -->
      <router-link to="/account/register" class="continue-btn mb-2">
        Create account
      </router-link>
      <router-link to="/account/login" class="secondary-btn">
        I already have an account
      </router-link>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../../composables/useAuth.js";

const { isLoggedIn, logout } = useAuth();
const router = useRouter();

onMounted(async () => {
    const hasAccessCookie = document.cookie.includes("accessToken=");
    const hasRefreshCookie = document.cookie.includes("refreshToken=");

    if (!hasAccessCookie && !hasRefreshCookie) {
        return;
    }

    try {
        const verify = await fetch("/api/user/me", {
            method: "GET",
            credentials: "include",
            headers: { "Accept": "application/json" }
        });

        if (verify.ok) {
            return router.push("/account/profile");
        }

        const refresh = await fetch("/api/account/refresh", {
            method: "POST",
            credentials: "include",
            headers: { "Accept": "application/json" }
        });

        if (refresh.ok) {
            return router.push("/account/profile");
        }

        console.warn("Auto-login failed (refresh rejected)");

    } catch (err) {
        console.error("Auto-login error:", err);
    }
});
</script>

<style scoped>
.welcome-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
}

.welcome-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.welcome-image {
  width: auto;
  max-width: 250px;
}

.title {
  font-size: 2rem;
  font-weight: 900;
}

.subtitle {
  font-size: 1.2rem;
  color: #444;
}

/* === PRZYCISK GŁÓWNY (Create account) === */
.continue-btn {
  width: 328px;
  height: 58px;

  display: flex;
  justify-content: center;
  align-items: center;

  background: #FEC41B;
  border: none;
  outline: none;
  border-radius: 6px;

  font-family: "Kode Mono", monospace;
  font-weight: 600;
  font-size: 18px;
  color: #FFFFFF;
  text-decoration: none;

  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.1s ease;

  /* pixel-art inner shadows */
  box-shadow:
    inset -6px 6px 0 #FFDA5D,
    inset 6px -6px 0 rgba(0,0,0,0.25);
}

/* --- hover = lekkie przyciemnienie --- */
.continue-btn:hover {
  background: #e0b017;
}

/* --- active = wciśnięcie --- */
.continue-btn:active {
  transform: translateY(2px);
  box-shadow:
    inset -3px 3px 0 #FFDA5D,
    inset 3px -3px 0 rgba(0,0,0,0.25);
}


/* === PRZYCISK DRUGORZĘDNY (link do loginu) === */
.secondary-btn {
  width: 328px;
  height: 58px;

  display: flex;
  justify-content: center;
  align-items: center;

  background: transparent;
  border: 3px solid #FEC41B;
  border-radius: 6px;

  font-family: "Kode Mono", monospace;
  font-weight: 600;
  font-size: 18px;
  color: #FEC41B;
  text-decoration: none;

  transition: background 0.15s ease, transform 0.1s ease, border-color 0.15s ease;
}

/* --- hover = delikatne wypełnienie + jaśniejszy outline --- */
.secondary-btn:hover {
  background: rgba(254,196,27,0.1);
  border-color: #ffd654;
}

/* --- active = mini wciśnięcie --- */
.secondary-btn:active {
  transform: translateY(2px);
}

/* MOBILE */
@media (max-width: 1024px) {
  .welcome-image {
    width: 80%;
    max-width: none;
  }

  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.5rem;
  }

  .continue-btn,
  .secondary-btn {
    width: 80%;
    font-size: 1.8rem;
    padding: 18px 0;
    border-radius: 14px;
  }
}
</style>
