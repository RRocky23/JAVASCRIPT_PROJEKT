<template>
  <div class="welcome-wrapper">
    <div class="welcome-container">
      
      <!-- Obrazek z pikselową grafiką -->
      <img class="welcome-image" src="/onboarding-adventure.png" alt="Adventure">

      <!-- Teksty -->
      <h2 class="title">Ready for a real<br>
                        adventure? Lets go!</h2>

      <!-- Przyciski -->
      <DefaultButton button-route="/account/register" button-text="Create account" :use-outline-style="false" />
      <DefaultButton button-route="/account/login" button-text="I already have an account" :use-outline-style="true" />

    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../../composables/useAuth.js";

import DefaultButton from "../../components/buttons/DefaultButton.vue";

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
