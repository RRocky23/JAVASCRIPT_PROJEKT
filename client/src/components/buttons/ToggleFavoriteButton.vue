<template>
    <button class="favorite-btn" @click.stop="toggle">
        <img :src="isFavorite ? '/icons/favorite/heart-filled-2.png' : '/icons/favorite/heart-outline-2.png'" alt="favorite button"/>
    </button>
</template>

<script setup>
    const props = defineProps({
        userPokemonId: String,
        isFavorite: Boolean
    });

    const emit = defineEmits(["toggle"]);

    const toggle = () => {
        emit("toggle", props.userPokemonId);
    };
</script>

<style scoped>
    .favorite-btn {
        width: 35px;
        height: 35px;
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
    }
    .favorite-btn img {
        width: 100%;
        height: 100%;
        display: block; 
    }
</style>