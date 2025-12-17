<template>
    <span class="type-badge-wrapper" :style="{ backgroundColor: getTypeBadgeColor(type, isDiscovered) }" @click="flip">
        <div class="type-badge" :class="{ flipped: isFlipped }">
            <div class="type-face badge-front" :style="frontStyle"></div>
            <div class="type-face badge-back" :style="backStyle"> {{ text }} </div>
        </div>
    </span>
</template>

<script setup>
    import { ref, computed } from "vue";
    import { getTypeBadgeColor } from "../../utils/colors";

    const props = defineProps({
        type: {
            type: String,
            required: true
        },
        startFlipped: {
            type: Boolean,
            default: false,
            required: true
        },
        isDiscovered: {
            type: Boolean,
            default: true,
            required: true
        }
    });

    const isFlipped = ref(props.startFlipped);
    
    const icon = computed(() => props.isDiscovered ? `/types/${props.type}.png` : `/types/unknown.png`);
    const text = computed(() => props.isDiscovered ? props.type : "unknown");

    const maskBase = computed(() => ({
        maskImage: `url(${icon.value})`,
        WebkitMaskImage: `url(${icon.value})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
    }));

    const frontStyle = computed(() => ({
        ...maskBase.value,
        backgroundColor: "#ffffff",
    }));

    const backStyle = computed(() => ({
        backgroundColor: "transparent",
        color: "#ffffff",
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: "0.75rem",
        fontWeight: "600",
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px 10px",
        boxShadow: "none"
    }));

    function flip(event) {
        event.stopPropagation();
        isFlipped.value = !isFlipped.value;
    }
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');

    .type-badge-wrapper {
        width: 70px;
        height: 25px;
        padding: 4px 10px;
        border-radius: 4px;
        perspective: 800px;
        cursor: pointer;
    }

    .type-badge-wrapper:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .type-badge {
        width: 100%;
        height: 100%;
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.6s ease-in-out;
    }

    .type-badge.flipped {
        transform: rotateY(180deg);
    }

    .type-face {
        position: absolute;
        inset: 0;
        border-radius: 6px;
        backface-visibility: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .badge-front {
        transform: rotateY(0deg);
    }

    .badge-back {
        transform: rotateY(180deg);
    }
</style>