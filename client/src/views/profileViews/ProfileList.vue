<template>
    <div class="text-center p-4 shadow-lg box-opaque">
        <ul>
            <li v-for="user in users" :key="user._id">
                {{ user.name }} {{ user.surname }}
            </li>
        </ul>
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue";
    import axios from "../../utils/axios.js";

    const users = ref([]);

    onMounted(async () => {
        const res = await axios.get('api/profile/list');
        users.value = res.data;
    });
</script>

<style scoped>
    .box-opaque {
        background-color: rgba(255, 255, 255, 0.85);
        border-radius: 20px;
    }
</style>