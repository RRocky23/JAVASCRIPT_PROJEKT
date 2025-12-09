<template>
    <div class="pokedex-container">
        <div class="search-bar">
            <input v-model="search" placeholder="Name of the Pokemon" />
            <span class="icon">🔍</span>
        </div>

        <div class="list">
            <PokemonCard v-for="p in filtered" :key="p.id" :pokemon="p" />
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from "vue";
    import axios from "../../utils/axios.js";
    import PokemonCard from "../../components/PokemonCard.vue";

    const search = ref("");
    const pokemons = ref([]);

    onMounted(async () => {
        const res = await axios.get(`api/pokedex/list`);
        pokemons.value = res.data;
        pokemons.value = res.data.map(p => ({ ...p, caught: true }));
    });

    const filtered = computed(() =>
        Array.isArray(pokemons.value) ? pokemons.value.filter(p =>
            p.name.toLowerCase().includes(search.value.toLowerCase())
        ) : []
);
</script>

<style scoped>
.pokedex-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.search-bar {
    position: sticky;
    top: 0;
    background: white;
    padding: 12px;
    z-index: 100;
    display: flex;
    gap: 8px;
    border-bottom: 1px solid #ccc;
}

.search-bar input {
    flex: 1;
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 8px;
}

.list {
    overflow-y: auto;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}
</style>