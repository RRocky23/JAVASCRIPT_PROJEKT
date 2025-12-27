<template>
    <div class="loading-state">
        <div class="spinner" />
    </div>
</template>

<script setup>
</script>

<style scoped>
    .loading-state {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top-color: #FEC41B;
        animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style>