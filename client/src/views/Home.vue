<template>
    <div class="text-center p-4 shadow-lg box-opaque">
        <h2 class="mb-3">Welcome to Pocket Monsters</h2>
        <p class="mb-4">
            Start your adventure to catch 'em all at <strong>Bialystok University of Technology</strong>!
            <br>
            Explore, train and fight battles to become a true Master of the campus!
        </p>
        <div class="d-flex justify-content-between mt-3">
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
.box-opaque {
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: 20px;
}

button.btn {
  transition: transform 0.2s;
}
button.btn:hover {
  transform: scale(1.05);
}
</style>