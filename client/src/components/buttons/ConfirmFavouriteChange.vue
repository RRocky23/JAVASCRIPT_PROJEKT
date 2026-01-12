<template>
    <div class="confirm-bar">
        <p>You changed status of <strong>{{ count }}</strong>
            {{ count === 1 ? 'pokemon' : 'pokemons' }}. Are you sure?
        </p>
        <div class="actions">
            <button class="cancel" @click="$emit('cancel')">Cancel</button>
            <button class="save" @click="$emit('save')">Save</button>
        </div>
    </div>
</template>

<script setup>
    defineProps({
        count: { type: Number, required: true }
    });
</script>

<style scoped>
    .confirm-bar {
        position: sticky;
        bottom: 80px;
        background-color: #f8f8f8;
        border: 2px solid #E0E0E0;
        border-radius: 8px;
        padding: 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: "JetBrains Mono", monospace;
        font-size: 0.95rem;
        z-index: 50;
        box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    }

    .actions {
        display: flex;
        gap: 12px;
    }

    button {
        padding: 10px 16px;
        border-radius: 6px;
        font-family: "JetBrains Mono", monospace;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
    }

    button.cancel {
        background: transparent;
        border: 2px solid #999;
        color: #555;
    }

    button.cancel:hover {
        background: #e0e0e0;
    }

    button.save {
        background: #FEC41B;
        border: none;
        color: #fff;
    }

    button.save:hover {
        background: #e5b30d;
    }
</style>