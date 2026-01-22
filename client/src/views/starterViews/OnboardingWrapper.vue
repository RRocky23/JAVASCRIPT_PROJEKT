<template>
  <div class="onboarding-layout">
    <div class="animated-content">
      <router-view v-slot="{ Component }">
        <Transition name="onboarding" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </Transition>
      </router-view>
    </div>
    <div class="static-footer">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressWidth }"></div>
      </div>
      <DefaultButton button-route="/starter/onboarding4" button-text="Continue" :use-outline-style="false" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useOnboardingAutoRotate } from "../../composables/useOnboardingAutoRotate.js";

import DefaultButton from '../../components/buttons/DefaultButton.vue';

const router = useRouter();
const route = useRoute();

useOnboardingAutoRotate();

const progressWidth = computed(() => {
  if (route.name === 'Onboarding1') return '33%';
  if (route.name === 'Onboarding2') return '66%';
  if (route.name === 'Onboarding3') return '100%';
  return '0%';
});

const goToOnboarding4 = () => {
  router.push('/starter/onboarding4');
};
</script>

<style scoped>
@import '../client/src/styles/OnboardingWrapperStyles.css';
</style>