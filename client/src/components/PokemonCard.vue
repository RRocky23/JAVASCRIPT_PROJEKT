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
        return { background: lightenColor(col, 70) };
    });
</script>

<style scoped>
.pokemon-card {
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: 10px;
    cursor: pointer;
}

.pokemon-card.disabled {
    cursor: default;
}

.sprite {
    width: 70px;
    height: 70px;
}

.gray {
    filter: grayscale(100%) brightness(60%);
}

.info {
    margin-left: 10px;
}

.types {
    margin-top: 6px;
    display: flex;
    gap: 6px;
}
</style>
