<template>
    <button type="submit" class="cta-btn" :class="{ active: isFormValid && !loading }" :disabled="!isFormValid || loading">
        <span v-if="loading" class="spinner"></span>
        <span v-else>Continue</span>
    </button>
</template>

<script setup>
    const props = defineProps({
        isFormValid: { type: Boolean, required: true},
        loading: { type: Boolean, required: true }
    });
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Press+Start+2P&display=swap');

    .cta-btn {
        width: 100%;
        max-width: 400px;
        height: 60px;
        background: #FEC41B;
        border: none;
        outline: none;
        border-radius: 6px;
        font-family: "Kode Mono", monospace;
        font-weight: 600;
        font-size: 18px;
        color: #FFFFFF;
        text-align: center;
        cursor: pointer;
        transition: 
            background 0.15s ease,
            transform 0.1s ease,
            box-shadow 0.1s ease;
        box-shadow:
            inset -6px 6px 0 #FFDA5D,
            inset 6px -6px 0 rgba(0,0,0,0.25);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
    }

    .cta-btn:hover:not(:disabled) {
        background: #e5b017;
    }

    .cta-btn:active:not(:disabled) {
        transform: translateY(2px);
        box-shadow:
            inset -3px 3px 0 #FFDA5D,
            inset 3px -3px 0 rgba(0,0,0,0.25);
    }

    .cta-btn:disabled {
        cursor: not-allowed;
        opacity: 0.6;
        background: #E0E0E0;
        color: #BDBDBD;
        box-shadow: none;
    }

    .spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style>