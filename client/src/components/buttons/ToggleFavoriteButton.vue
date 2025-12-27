<template>
    <button class="favourite-btn" @click.stop="toggle">
        <img :src="isFavourite ? '/icons/favourite/heart-filled-2.png' : '/icons/favourite/heart-outline-2.png'" alt="favourite button"/>
    </button>
</template>

<script setup>
    const props = defineProps({
        userPokemonId: String,
        isFavourite: Boolean
    });

    const emit = defineEmits(["toggle"]);

    const toggle = () => {
        emit("toggle", props.userPokemonId);
    };
</script>

<style scoped>
    .favourite-btn {
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
    .favourite-btn img {
        width: 100%;
        height: 100%;
        display: block; 
    }
</style>