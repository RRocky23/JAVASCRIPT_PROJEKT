<template>
    <div class="welcome-big box-opaque">
        <h2 class="mb-3">Welcome to Pocket Monsters</h2>
        <p class="mb-4">
            Start your adventure to catch 'em all at <strong>Bialystok University of Technology</strong>!
            <br>
            Explore, train and fight battles to become a true Master of the campus!
        </p>
        <div class="d-flex justify-content-between mt-3 buttons">
            <router-link v-if="!isLoggedIn" to="/account/register" class="btn btn-secondary flex-grow-1 me-2">Sign Up</router-link>
            <router-link v-if="!isLoggedIn" to="/account/login" class="btn btn-primary flex-grow-1 ms-2">Sign In</router-link>
            <button v-if="isLoggedIn" @click="logout" class="btn btn-danger flex-grow-1">Sign Out</button>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth.js";

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
/* przezroczyste białe tło */
.box-opaque {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
}

/* OGROMNY WIDOK WELCOME */
.welcome-big {
  width: 50vw;
  max-width: 700px;
  padding: 40px 25px;
  font-size: 1.1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 32px;
}

.welcome-big h2 {
  font-size: 2rem;
  font-weight: 900;
}

.welcome-big p {
  font-size: 1.2rem;
  line-height: 1.8;
}

.buttons button,
.buttons .btn {
  font-size: 1.1rem !important;
  padding: 10px 16px !important;
}

.ms-auto,
  nav .nav-item {
    display: none !important;
  }

/* na telefonach jeszcze większe */
@media (max-width: 1024px) {
  .welcome-big {
    width: 95vw !important;
    max-width: 100vw !important;
    padding: 70px 20px !important;
    font-size: 2rem !important;
  }

  .welcome-big h2 {
    font-size: 3.2rem !important;
  }

  .welcome-big p {
    font-size: 2rem !important;
    line-height: 1.7 !important;
  }

  .buttons .btn {
    font-size: 2rem !important;
    padding: 18px 26px !important;
  }
}
</style>
