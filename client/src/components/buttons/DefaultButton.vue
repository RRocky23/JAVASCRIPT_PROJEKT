<template>
    <router-link :to="buttonRoute" class="btn-defaults"
        :class="[ useOutlineStyle ? 'outline-btn' : 'default-btn', { 'btn-disabled': isDisabled }]"
        :aria-disabled="isDisabled"
        @click="handleClick">
        <span v-if="useGoogle" class="google-icon">G</span>
        {{ buttonText }}
    </router-link>
</template>

<script setup>
    const props = defineProps({
        buttonRoute: {type: String, required: true},
        buttonText: {type: String, required: true},
        useOutlineStyle: {type: Boolean, default: false},
        isDisabled: { type: Boolean, default: false },
        useGoogle: { type: Boolean, default: false }
    });

    function handleClick(e) {
        if(props.isDisabled) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }
</script>

<style scoped>
    .btn-defaults {
        width: 100%;
        max-width: 400px;
        height: 60px;

        display: flex;
        justify-content: center;
        align-items: center;

        border-radius: 6px;

        font-family: "Kode Mono", monospace;
        font-weight: 600;
        font-size: 18px;
        text-decoration: none;

        cursor: pointer;
    }

    .default-btn {
        background: #FEC41B;
        border: none;
        outline: none;

        color: #FFFFFF;

        transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.1s ease;

        box-shadow:
            inset -6px 6px 0 #FFDA5D,
            inset 6px -6px 0 rgba(0,0,0,0.25);
    }

    .default-btn:hover {
        background: #e0b017;
    }

    .default-btn:active {
        transform: translateY(2px);
        box-shadow:
            inset -3px 3px 0 #FFDA5D,
            inset 3px -3px 0 rgba(0,0,0,0.25);
    }

    .outline-btn {
        background: transparent;
        border: 3px solid #FEC41B;

        color: #FEC41B;
        text-decoration: none;

        transition: background 0.15s ease, transform 0.1s ease, border-color 0.15s ease;
    }

    .outline-btn:hover {
        background: rgba(254,196,27,0.1);
        border-color: #ffd654;
    }

    .outline-btn:active {
        transform: translateY(2px);
    }

    .btn-disabled {
        pointer-events: none;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
        opacity: 0.6;
    }

    .default-btn.btn-disabled {
        background: #d6d6d6;
        color: #ffffff;
    }

    .outline-btn.btn-disabled {
        border-color: #d6d6d6;
        color: #d6d6d6;
        background: transparent;
    }

    .google-icon {
        font-size: 20px;
        font-weight: bold;
        margin: 0 15px 0 0;
    }   
</style>