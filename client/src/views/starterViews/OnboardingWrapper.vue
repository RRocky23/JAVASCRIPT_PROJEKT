<template>
  <div class="onboarding-layout">
    <div class="animated-content">
      <Transition name="onboarding" mode="out-in">
        <router-view :key="$route.path" />
      </Transition>
    </div>
    <div class="static-footer">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressWidth }"></div>
      </div>
      <button class="continue-btn" @click="goToOnboarding4">Continue</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useOnboardingAutoRotate } from "../../composables/useOnboardingAutoRotate.js";

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

.continue-btn {
  width: 328px;
  height: 58px;

  display: flex;
  justify-content: center;
  align-items: center;

  background: #FEC41B;
  border: none;
  outline: none;
  border-radius: 6px;

  font-family: "Kode Mono", monospace;
  font-weight: 600;
  font-size: 18px;
  color: #FFFFFF;
  text-decoration: none;

  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.1s ease;

  box-shadow:
    inset -6px 6px 0 #FFDA5D,
    inset 6px -6px 0 rgba(0,0,0,0.25);
}

.continue-btn:hover {
  background: #e0b017;
}

.continue-btn:active {
  transform: translateY(2px);
  box-shadow:
    inset -3px 3px 0 #FFDA5D,
    inset 3px -3px 0 rgba(0,0,0,0.25);
}


.secondary-btn {
  width: 328px;
  height: 58px;

  display: flex;
  justify-content: center;
  align-items: center;

  background: transparent;
  border: 3px solid #FEC41B;
  border-radius: 6px;

  font-family: "Kode Mono", monospace;
  font-weight: 600;
  font-size: 18px;
  color: #FEC41B;
  text-decoration: none;

  transition: background 0.15s ease, transform 0.1s ease, border-color 0.15s ease;
}

.secondary-btn:hover {
  background: rgba(254,196,27,0.1);
  border-color: #ffd654;
}

.secondary-btn:active {
  transform: translateY(2px);
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