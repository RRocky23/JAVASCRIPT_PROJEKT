<template>
    <div class="text-center p-4 shadow-lg box-opaque">
        <div class="scroll-container">
            <ul>
                <li v-for="pokemon in pokemons" :key="pokemon._id">
                    <img :src="pokemon.spriteURL" alt="pokemon sprite" />
                    <p>{{ pokemon.name }} #{{pokemon.pokedexNumber}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue";
    import axios from "../../utils/axios.js";

    const pokemons = ref([]);

    onMounted(async () => {
        const res = await axios.get('api/profile/list');
        pokemons.value = res.data;
    });
</script>

<style scoped>
    .box-opaque {
        background-color: rgba(255, 255, 255, 0.85);
        border-radius: 20px;
    }

    .scroll-container {
        max-height: 400px;
        min-width: 300px;
        overflow-y: auto;
    }

    ul {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 1rem;
    }
</style>