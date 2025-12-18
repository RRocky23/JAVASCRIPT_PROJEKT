<template>
    <button class="favorite-btn" @click.stop="toggle">
        {{ isFavorite ? '❤️' : '🤍' }}
    </button>
</template>

<script setup>
    import { ref, watch } from "vue";

    const props = defineProps({
        pokemonNumber: Number,
        favorites: Array,
        isFavorite: Boolean
    });

    const emit = defineEmits(["update:favorites"]);

    const isFavorite = ref(props.isFavorite);

    watch(() => props.favorites, (newVal) => {
        isFavorite.value = newVal.includes(props.pokemonNumber);
    });

    const toggle = () => {
        let updatedFavorites = [...props.favorites];
        const index = updatedFavorites.indexOf(props.pokemonNumber);

        if(index > -1) {
            updatedFavorites.splice(index, 1);
        }else {
            updatedFavorites.push(props.pokemonNumber);
        }

        emit("update:favorites", updatedFavorites);
        localStorage.setItem("pokemonFavorites", JSON.stringify(updatedFavorites));
    };
</script>

<style scoped>
    .favorite-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 4px;
    }
</style>