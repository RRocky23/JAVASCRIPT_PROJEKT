<template>
  <div class="login-form">
    <header class="header">
      <button class="back-btn" @click="goBack">‹</button>
      <h1 class="header-title">Log In</h1>
      <div class="header-spacer"></div>
    </header>
    
    <div class="content">
      <h2 class="title">Welcome back!<br>Enter your Info below:</h2>
      
      <form @submit.prevent="handleSubmit" class="form">
        <div 
          class="input-group" 
          :class="{ 
            focused: emailFocused, 
            filled: userIdentifier, 
            valid: isEmailValid,
            error: fieldErrors.userIdentifier
          }"
        >
          <input 
            type="text" 
            v-model="userIdentifier"
            placeholder="E-mail or username"
            @focus="emailFocused = true"
            @blur="emailFocused = false"
            :disabled="loading"
          />
        </div>
        
        <div 
          class="input-group" 
          :class="{ 
            focused: passwordFocused, 
            filled: password, 
            valid: isPasswordValid,
            error: fieldErrors.password
          }"
        >
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="password"
            placeholder="Password"
            @focus="passwordFocused = true"
            @blur="passwordFocused = false"
            :disabled="loading"
          />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
          </button>
        </div>
        
        <p 
          class="hint" 
          :class="{ 
            error: fieldErrors.password || fieldErrors.userIdentifier,
            success: isFormValid && !fieldErrors.password && !fieldErrors.userIdentifier
          }"
        >
          {{ hintMessage }}
        </p>

        <div v-if="generalError" class="alert-error">
          {{ generalError }}
        </div>
        
        <FormButton :is-form-valid=isFormValid :loading=loading />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth.js';

import FormButton from '../../components/buttons/FormButton.vue';


const router = useRouter();
const { login, loading } = useAuth();

const userIdentifier = ref('');
const password = ref('');
const showPassword = ref(false);
const emailFocused = ref(false);
const passwordFocused = ref(false);
const fieldErrors = reactive({});
const generalError = ref('');

const isEmailValid = computed(() => {
  return userIdentifier.value.length > 0;
});

const isPasswordValid = computed(() => {
  return password.value.length > 0;
});

const isFormValid = computed(() => {
  return isEmailValid.value && isPasswordValid.value;
});

const hintMessage = computed(() => {
  if (fieldErrors.password || fieldErrors.userIdentifier) {
    return fieldErrors.password || fieldErrors.userIdentifier || 'INVALID CREDENTIALS';
  }
  if (!userIdentifier.value && !password.value) {
    return 'SURE YOU REMEMBER YOUR PASSWORD?';
  }
  if (isFormValid.value) {
    return 'LOOKS GOOD!';
  }
  return 'SURE YOU REMEMBER YOUR PASSWORD?';
});

const goBack = () => {
  router.push('/account/login');
};

const handleSubmit = async () => {
  Object.keys(fieldErrors).forEach(key => delete fieldErrors[key]);
  generalError.value = '';

  try {
    await login(userIdentifier.value, password.value, false);
    router.push('/home');
  } catch (err) {
    const { response } = err;

    if (!response) {
      generalError.value = 'Network error, please try again.';
      return;
    }

    if (response.status === 500) {
      router.push({ 
        path: '/error', 
        query: { status: 500, message: 'Internal server error' } 
      });
      return;
    }

    if (response.data?.errors) {
      fieldErrors.userIdentifier = response.data.errors.userIdentifier || 'Invalid credentials';
      fieldErrors.password = response.data.errors.password || 'Invalid credentials';
    }

    else if (response.data?.message) {
      fieldErrors.userIdentifier = 'Invalid credentials';
      fieldErrors.password = 'Invalid credentials';
    }

    else {
      fieldErrors.userIdentifier = 'Invalid credentials';
      fieldErrors.password = 'Invalid credentials';
    }
  }
};
</script>

<style scoped>
@import "../client/src/styles/SharedStyles.css";
@import "../client/src/styles/LoginPageStyles.css";
</style>