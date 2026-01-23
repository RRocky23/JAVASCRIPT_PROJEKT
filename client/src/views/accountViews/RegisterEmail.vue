<template>
  <div class="register-email">
    <div class="header">
      <button class="back-btn" @click="router.push('/account/register')">‹</button>
      <div class="header-title">Create account</div>
      <div class="header-spacer"></div>
    </div>

    <div class="content">
      <div class="title">
        What is your email<br />address?
      </div>

      <form class="form" @submit.prevent="handleContinue">
        <div 
          class="input-group" 
          :class="{ 
            focused: isFocused, 
            valid: isAvailable, 
            error: hasError,
            checking: isChecking 
          }"
        >
          <input
            v-model="email"
            type="email"
            placeholder="E-mail"
            @focus="isFocused = true"
            @blur="isFocused = false"
            @input="onEmailInput"
          />
        </div>

        <div 
          class="hint" 
          :class="{ 
            error: hasError, 
            success: isAvailable && !hasError,
            warning: isChecking 
          }"
        >
          {{ hintMessage }}
        </div>

        <button 
          type="submit" 
          class="cta-btn" 
          :class="{ active: isAvailable && !hasError }"
          :disabled="!isAvailable || hasError"
        >
          Continue
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../../utils/axios.js';

const router = useRouter();

const email = ref('');
const isFocused = ref(false);
const hasError = ref(false);
const isAvailable = ref(false);
const isChecking = ref(false);

let checkTimeout = null;

const isValidFormat = computed(() => {
  return /^[\w.-]+@[A-Za-z\d.-]+\.[A-Za-z]{2,}$/.test(email.value);
});

const hintMessage = computed(() => {
  if (!email.value) {
    return 'CHOOSE YOUR FAVOURITE ONE';
  }
  if (isChecking.value) {
    return 'CHECKING AVAILABILITY...';
  }
  if (hasError.value) {
    return 'EMAIL ALREADY IN USE OR INVALID FORMAT';
  }
  if (isAvailable.value) {
    return "GREAT, LET'S SEE WHAT'S NEXT!";
  }
  if (!isValidFormat.value && email.value.length > 0) {
    return 'REMEMBER, IT HAS TO BE AN ACTUAL EMAIL.';
  }
  return 'CHOOSE YOUR FAVOURITE ONE';
});

const onEmailInput = () => {
  hasError.value = false;
  isAvailable.value = false;

  if (checkTimeout) {
    clearTimeout(checkTimeout);
  }

  if (!isValidFormat.value) {
    return;
  }

  isChecking.value = true;
  
  checkTimeout = setTimeout(async () => {
    try {
      const response = await axios.get('/api/account/check-email', {
        params: { email: email.value }
      });
      
      isAvailable.value = response.data.available;
      hasError.value = !response.data.available;
    } catch (error) {
      if (error.response?.status === 409) {
        isAvailable.value = false;
        hasError.value = true;
      } else if (error.response?.status === 400) {
        hasError.value = true;
      }
    } finally {
      isChecking.value = false;
    }
  }, 500);
};

const handleContinue = () => {
  if (isAvailable.value && !hasError.value) {
    sessionStorage.setItem('registerEmail', email.value);
    router.push('/account/register/password');
  }
};
</script>

<style scoped>
@import '../client/src/styles/RegisterEmailStyles.css';
</style>