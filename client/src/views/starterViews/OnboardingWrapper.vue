<template>
  <Transition name="onboarding" mode="out-in">
    <router-view :key="$route.path" />
  </Transition>
</template>

<script setup>
import { useOnboardingAutoRotate } from "../../composables/useOnboardingAutoRotate.js";
useOnboardingAutoRotate();
</script>

<style scoped>
.onboarding-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.onboarding-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.onboarding-enter-from,
.onboarding-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>