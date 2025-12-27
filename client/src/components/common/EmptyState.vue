<template>
    <div class="empty-state">
        <img :src=imageUrl alt="Empty" class="empty-image" />
        <h2 class="empty-title">Oops!</h2>
        <p class="empty-text">{{ emptyText }}</p>
        
        <DefaultButton :button-route="buttonRoute" :button-text="buttonText" />
    </div>
</template>

<script setup>
    import DefaultButton from '../buttons/DefaultButton.vue'

    const props = defineProps({
        imageUrl: {type: String, required: true, default: "/favourite-empty-substitute.png"},
        emptyText: {type: String, required: true},
        buttonRoute: {type: String, required: true},
        buttonText: {type: String, required: true}
    });
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');

    .empty-state {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 40px 20px;
    }

    .empty-image {
        width: 200px;
        height: 200px;
        margin-bottom: 30px;
        image-rendering: pixelated;
    }

    .empty-title {
        font-family: "JetBrains Mono", monospace;
        font-size: 2rem;
        font-weight: 600;
        margin: 0 0 16px 0;
        color: #1A1A1A;
    }

    .empty-text {
        font-family: "JetBrains Mono", monospace;
        font-size: 0.9rem;
        color: #666;
        margin: 0 0 30px 0;
        max-width: 300px;
    }
</style>