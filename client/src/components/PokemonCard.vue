<template>
    <div class="pokemon-card" :class="{ disabled: !pokemon.caught }" :style="bgStyle" @click="pokemon.caught && emit('click', pokemon)">
    
        <img :src="pokemon.sprite" class="sprite" :class="{ gray: !pokemon.caught }" />

        <div class="info">
            <div class="name">{{ pokemon.caught ? pokemon.name : "???" }}</div>
            <div class="number">N°{{ pokemon.id.toString().padStart(3, "0") }}</div>

            <div class="types" v-if="pokemon.caught">
                <TypeBadge v-for="t in pokemon.types" :key="t" :type="t" />
            </div>
        </div>
    </div>
</template>

<script setup>
    import TypeBadge from "./TypeBadge.vue";

    import { computed } from "vue";
    import { TYPE_COLORS } from "../utils/colors.js";
    import { lightenColor } from "../utils/colors.js";

    const props = defineProps({
        pokemon: Object,
    });

    const emit = defineEmits(["click"]);

    const bgStyle = computed(() => {
        if(!props.pokemon.caught || !props.pokemon.types?.length) {
            return { background: "#e0e0e0" };
        }

        const main = props.pokemon.types[0];
        const col = TYPE_COLORS[main] || "#aaa";
        return { background: lightenColor(col, 30) };
    });
</script>

<style scoped>
.pokemon-card {
    display: flex;
    align-items: center;
    padding: 18px;
    cursor: pointer;
    transition: transform 0.15s ease;
}

.pokemon-card:not(.disabled):hover {
    transform: scale(1.03);
}

.pokemon-card.disabled {
    cursor: default;
}

.sprite {
    width: 90px;
    height: 90px;
}

.gray {
    filter: grayscale(100%) brightness(60%);
}

.info {
    margin-left: 16px;
}

.name {
    font-size: 1.4rem;
    font-weight: bold;
}

.number {
    margin-top: 2px;
    font-size: 1rem;
    opacity: 0.8;
}

.types {
    margin-top: 8px;
    display: flex;
    gap: 8px;
}
</style>
