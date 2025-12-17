<template>
    <div class="pokedex-container">
        <div class="search-bar">
            <input v-model="search" placeholder="Name of the Pokemon" />
        </div>

        <div class="list">
            <PokemonCard v-for="p in filtered" :key="p.id" :pokemon="p" />
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from "vue";
    import axios from "../../utils/axios.js";
    import PokemonCard from "../../components/pokedex/PokemonCard.vue";

    const search = ref("");
    const pokemons = ref([]);

    onMounted(async () => {
        const res = await axios.get(`api/pokedex/list`);
        pokemons.value = res.data;
        pokemons.value = res.data.map(p => ({ ...p, caught: true }));
    });

    const filtered = computed(() => {
        if(!Array.isArray(pokemons.value)) {
            return [];
        }

        const term = search.value.toLowerCase();

        return pokemons.value
            .filter(p => p.name.toLowerCase().includes(term))
            .map(p => ({...p, name: p.name.charAt(0).toUpperCase() + p.name.slice(1).toLowerCase()
        }));
    });
</script>

<style scoped>
.pokedex-container {
    height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.search-bar {
    position: sticky;
    top: 0;
    background: white;
    padding: 16px;
    z-index: 100;
    display: flex;
    gap: 10px;
    border-bottom: 1px solid #ccc;
}

.search-bar input {
    flex: 1;
    padding: 16px;
    border: 2px solid #ccc;
    font-size: 1.2rem;
}

.icon {
    font-size: 1.5rem;
    display: flex;
    align-items: center;
}

.list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    scrollbar-width: none;
}

.list::-webkit-scrollbar {
    width: 0;
    height: 0;
}
</style>