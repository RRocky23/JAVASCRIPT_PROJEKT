<template>
    <div class="header">
        <div class="header-spacer"></div>
        <div class="header-title"> {{ headerTitle }}</div>
        <div class="header-spacer"></div>
    </div>
</template>

<script setup>
    const props = defineProps({
        headerTitle: {type: String, required: true}
    });
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        background-color: #fff;
        flex-shrink: 0;
    }

    .header-title {
        font-family: "JetBrains Mono", monospace;
        font-size: 1.2rem;
        font-weight: 500;
        color: #000;
    }

    .header-spacer {
        width: 36px;
    }
</style>