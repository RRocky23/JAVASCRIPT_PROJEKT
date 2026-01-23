<template>
  <div class="register-username">
    <div class="header">
      <button class="back-btn" @click="goBack" :disabled="isSubmitting">‹</button>
      <div class="header-title">Create account</div>
      <div class="header-spacer"></div>
    </div>

    <div class="content">
      <div class="title">
        One last thing.<br />Your name
      </div>

      <form class="form" @submit.prevent="handleSubmit">
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
            v-model="username"
            type="text"
            placeholder="Name"
            @focus="isFocused = true"
            @blur="isFocused = false"
            @input="onUsernameInput"
            :disabled="isSubmitting"
          />
        </div>

        <div 
          class="hint" 
          :class="{ 
            error: hasError, 
            success: isAvailable,
            warning: isChecking 
          }"
        >
          {{ hintMessage }}
        </div>

        <div v-if="generalError" class="alert-error">
          {{ generalError }}
        </div>

        <button 
          type="submit" 
          class="cta-btn" 
          :class="{ active: isAvailable && !hasError && !isSubmitting }"
          :disabled="!isAvailable || hasError || isSubmitting"
        >
          <span v-if="isSubmitting" class="spinner"></span>
          <span v-else>Continue</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../../utils/axios.js';

const router = useRouter();

const username = ref('');
const isFocused = ref(false);
const hasError = ref(false);
const isAvailable = ref(false);
const isChecking = ref(false);
const isSubmitting = ref(false);
const generalError = ref('');

let checkTimeout = null;

onMounted(() => {
  const savedEmail = sessionStorage.getItem('registerEmail');
  const savedPassword = sessionStorage.getItem('registerPassword');
  
  if (!savedEmail || !savedPassword) {
    router.push('/account/register/email');
  }
});

const isValidFormat = computed(() => {
  return username.value.length >= 2 && 
         username.value.length <= 20 &&
         /^[a-zA-Z0-9_]+$/.test(username.value);
});

const hintMessage = computed(() => {
  if (!username.value) {
    return 'HOW YOU WANT TO BE CALLED?';
  }
  if (isChecking.value) {
    return 'CHECKING AVAILABILITY...';
  }
  if (hasError.value) {
    return 'USERNAME ALREADY TAKEN OR INVALID';
  }
  if (isAvailable.value) {
    return 'NICE TO MEET YOU!';
  }
  if (username.value.length < 2) {
    return 'USERNAME TOO SHORT (MIN 2 CHARACTERS)';
  }
  if (username.value.length > 20) {
    return 'USERNAME TOO LONG (MAX 20 CHARACTERS)';
  }
  if (!isValidFormat.value) {
    return 'USE ONLY LETTERS, NUMBERS, AND UNDERSCORES';
  }
  return 'HOW YOU WANT TO BE CALLED?';
});

const onUsernameInput = () => {
  hasError.value = false;
  isAvailable.value = false;
  generalError.value = '';

  if (checkTimeout) {
    clearTimeout(checkTimeout);
  }

  if (!isValidFormat.value || username.value.length < 2) {
    return;
  }

  isChecking.value = true;
  
  checkTimeout = setTimeout(async () => {
    try {
      const response = await axios.get('/api/account/check-username', {
        params: { username: username.value }
      });
      
      isAvailable.value = response.data.available;
      hasError.value = !response.data.available;
    } catch (error) {
      if (error.response?.status === 409) {
        isAvailable.value = false;
        hasError.value = true;
      } else {
        generalError.value = 'Error checking username availability';
      }
    } finally {
      isChecking.value = false;
    }
  }, 500);
};

const handleSubmit = async () => {
  if (!isAvailable.value || hasError.value || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;
  generalError.value = '';

  const email = sessionStorage.getItem('registerEmail');
  const password = sessionStorage.getItem('registerPassword');

  try {
    await axios.post('/api/account/register', {
      username: username.value,
      email,
      password
    });

    sessionStorage.removeItem('registerEmail');
    sessionStorage.removeItem('registerPassword');

    router.push('/account/register/success');
  } catch (error) {
    if (error.response?.status === 409) {
      hasError.value = true;
      generalError.value = 'Username or email already taken';
    } else if (error.response?.status === 500) {
      router.push({ 
        path: '/error', 
        query: { status: 500, message: 'Internal server error' } 
      });
    } else {
      generalError.value = error.response?.data?.message || 'Registration failed';
    }
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  if (!isSubmitting.value) {
    router.push('/account/register/password');
  }
};
</script>

<style scoped>
@import '../client/src/styles/RegisterUsernameStyles.css';
</style>