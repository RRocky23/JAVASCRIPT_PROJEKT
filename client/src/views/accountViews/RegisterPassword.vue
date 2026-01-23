<template>
  <div class="register-password">
    <div class="header">
      <button class="back-btn" @click="goBack">‹</button>
      <div class="header-title">Create account</div>
      <div class="header-spacer"></div>
    </div>

    <div class="content">
      <div class="title">And now<br />a password:</div>

      <form class="form" @submit.prevent="handleContinue">
        <div 
          class="input-group" 
          :class="{ 
            focused: isFocused, 
            valid: isValid, 
            error: hasError 
          }"
        >
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            @focus="isFocused = true"
            @blur="isFocused = false"
            @input="validatePassword"
          />
          <button 
            type="button" 
            class="toggle-password" 
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
          </button>
        </div>

        <div 
          class="hint" 
          :class="{ 
            error: hasError, 
            success: isValid && !hasError 
          }"
        >
          {{ hintMessage }}
        </div>

        <ul v-if="password.length > 0" class="password-rules">
          <li :class="{ ok: passwordRules.minLength }">
            {{ passwordRules.minLength ? '✔️' : '✖️' }} minimum 8 characters
          </li>
          <li :class="{ ok: passwordRules.maxLength }">
            {{ passwordRules.maxLength ? '✔️' : '✖️' }} maximum 30 characters
          </li>
          <li :class="{ ok: passwordRules.uppercase }">
            {{ passwordRules.uppercase ? '✔️' : '✖️' }} at least 1 uppercase letter
          </li>
          <li :class="{ ok: passwordRules.number }">
            {{ passwordRules.number ? '✔️' : '✖️' }} at least 1 number
          </li>
          <li :class="{ ok: passwordRules.special }">
            {{ passwordRules.special ? '✔️' : '✖️' }} at least 1 special character
          </li>
        </ul>

        <button 
          type="submit" 
          class="cta-btn" 
          :class="{ active: isValid && !hasError }"
          :disabled="!isValid || hasError"
        >
          Continue
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const password = ref('');
const isFocused = ref(false);
const hasError = ref(false);
const showPassword = ref(false);

onMounted(() => {
  const savedEmail = sessionStorage.getItem('registerEmail');
  if (!savedEmail) {
    router.push('/account/register/email');
  }
});

const passwordRules = computed(() => ({
  minLength: password.value.length >= 8,
  maxLength: password.value.length <= 30,
  uppercase: /[A-Z]/.test(password.value),
  number: /\d/.test(password.value),
  special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password.value)
}));

const isValid = computed(() => {
  return Object.values(passwordRules.value).every(v => v === true);
});

const hintMessage = computed(() => {
  if (!password.value) {
    return 'MAKE IT STRONG LIKE TAUROS';
  }
  if (!isValid.value) {
    return 'DID YOU FORGET SOMETHING?';
  }
  return "I WON'T TELL ANYONE";
});

const validatePassword = () => {
  hasError.value = password.value.length > 0 && !isValid.value;
};

const handleContinue = () => {
  if (isValid.value && !hasError.value) {
    sessionStorage.setItem('registerPassword', password.value);
    router.push('/account/register/username');
  }
};

const goBack = () => {
  router.push('/account/register/email');
};
</script>

<style scoped>
@import '../client/src/styles/RegisterPasswordStyles.css';
</style>