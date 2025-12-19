<template>
    <button class="favorite-btn" @click.stop="toggle">
        <img :src="isFavorite ? '/icons/favorite/heart-filled.png' : '/icons/favorite/heart-outline.png'" alt="favorite button"/>
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
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
    }
</style>