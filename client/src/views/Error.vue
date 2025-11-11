<template>
    <div class="text-center mt-5 p-4 shadow-lg box-opaque" style="max-width:600px; margin:auto;">
        <h1>Something went wrong</h1>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <p v-else>{{ defaultMessage }}</p>
        <p v-if="status">Status code: {{ status }}</p>
        <router-link to="/home" class="btn btn-primary mt-3">Go Home</router-link>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    const route = useRoute();
    const router = useRouter();

    const state = router.options.history.state || {};
    const stateMessage = state.message;
    const stateStatus = state.status;

    const queryMessage = route.query.message;
    const queryStatus = route.query.status;

    const errorMessage = ref(stateMessage || queryMessage || '');
    const status = ref(stateStatus || queryStatus || '');

    const defaultMessage = "The page you requested cannot be displayed at this time.";
</script>

<style scoped>
.box-opaque {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
}
</style>
