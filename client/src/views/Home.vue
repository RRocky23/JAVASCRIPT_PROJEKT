<template>
    <div class="text-center p-4 shadow-lg box-opaque">
        <h2 class="mb-3">Welcome to Pocket Monsters</h2>
        <p class="mb-4">
            Start your adventure to cath 'em all at <strong>Bialystok University of Technology</strong>!
            <br>
            Explore, train, and fight battles to become a true Master of the campus!
        </p>
        <div class="d-flex justify-content-between mt-3">
            <router-link to="/account/register" class="btn btn-secondary flex-grow-1 me-2">Sign Up</router-link>
            <router-link to="/account/login" class="btn btn-primary flex-grow-1 ms-2">Sign In</router-link>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.box-opaque {
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: 20px;
}

button.btn {
  transition: transform 0.2s;
}
button.btn:hover {
  transform: scale(1.05);
}
</style>