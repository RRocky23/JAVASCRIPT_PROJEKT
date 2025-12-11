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
        
        <button 
          type="submit" 
          class="cta-btn"
          :class="{ active: isFormValid && !loading }"
          :disabled="!isFormValid || loading"
        >
          <span v-if="loading" class="spinner"></span>
          <span v-else>Continue</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth.js';

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
@import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');

.login-form {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #1A1A1A;
  flex-shrink: 0;
}

.back-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
}

.header-title {
  font-family: "Kode Mono", monospace;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
}

.header-spacer {
  width: 36px;
}

.content {
  flex: 1;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow-y: auto;
}

.title {
  font-family: "Kode Mono", monospace;
  font-size: 1.8rem;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 40px;
  line-height: 1.4;
}

.form {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  position: relative;
  border: 2px solid #E0E0E0;
  border-radius: 6px;
  transition: border-color 0.25s ease;
  background-color: #fff;
}

.input-group.focused {
  border-color: #1A1A1A;
}

.input-group.valid {
  border-color: #27AE60;
}

.input-group.error {
  border-color: #EB5757;
  background-color: rgba(235, 87, 87, 0.1);
}

.input-group input {
  width: 100%;
  padding: 16px;
  padding-right: 50px;
  font-family: "Kode Mono", monospace;
  font-size: 1rem;
  border: none;
  outline: none;
  background: transparent;
  color: #1A1A1A;
}

.input-group input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.toggle-password {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
}

.hint {
  font-family: "Kode Mono", monospace;
  font-size: 0.9rem;
  color: #444;
  text-align: center;
  transition: all 0.25s;
  min-height: 20px;
}

.hint.error {
  color: #EB5757;
}

.hint.success {
  color: #27AE60;
}

.alert-error {
  margin-top: 10px;
  padding: 12px 16px;
  background-color: rgba(235, 87, 87, 0.1);
  border: 1px solid #EB5757;
  border-radius: 6px;
  color: #EB5757;
  font-family: "Kode Mono", monospace;
  font-size: 0.9rem;
  text-align: center;
}

.cta-btn {
  width: 100%;
  max-width: 400px;
  height: 58px;
  background: #FEC41B;
  border: none;
  outline: none;
  border-radius: 6px;
  font-family: "Kode Mono", monospace;
  font-weight: 600;
  font-size: 18px;
  color: #FFFFFF;
  text-align: center;
  cursor: pointer;
  transition: 
    background 0.15s ease,
    transform 0.1s ease,
    box-shadow 0.1s ease;
  box-shadow:
    inset -6px 6px 0 #FFDA5D,
    inset 6px -6px 0 rgba(0,0,0,0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.cta-btn:hover:not(:disabled) {
  background: #e5b017;
}

.cta-btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow:
    inset -3px 3px 0 #FFDA5D,
    inset 3px -3px 0 rgba(0,0,0,0.25);
}

.cta-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background: #E0E0E0;
  color: #BDBDBD;
  box-shadow: none;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .title {
    font-size: 2.5rem;
  }

  .form input {
    font-size: 1.4rem;
    padding: 18px;
    padding-right: 60px;
  }

  .cta-btn {
    font-size: 1.8rem;
    height: 70px;
  }

  .hint {
    font-size: 1.2rem;
  }
}
</style>