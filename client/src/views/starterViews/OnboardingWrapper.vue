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
@import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');

<style scoped>
.onboarding-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.animated-content {
  height: 60vh;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.static-footer {
  flex-shrink: 0;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  width: 60%;
  height: 14px;
  background: #eee;
  border-radius: 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #f4b400;
  transition: width 300ms ease;
}

.onboarding-enter-active,
.onboarding-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.onboarding-enter-from,
.onboarding-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

@media (max-width: 1024px) {
  .progress-bar {
    width: 80% !important;
    height: 24px !important;
    border-radius: 12px !important;
  }

  .continue-btn {
    width: 85% !important;
    padding: 20px !important;
    font-size: 1.8rem !important;
    border-radius: 14px !important;
  }
}
</style>