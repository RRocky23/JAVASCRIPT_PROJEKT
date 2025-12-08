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
          class="btn btn-primary" 
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
.register-username {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 22px;
  background-color: #1A1A1A;
  flex-shrink: 0;
}

.back-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  padding: 6px;
  transition: opacity 0.2s;
}

.back-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.header-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #fff;
}

.header-spacer {
  width: 36px;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 28px;
  overflow-y: auto;
  text-align: center;
}

.title {
  font-size: 1.8rem;
  font-weight: 900;
  color: #1A1A1A;
  margin-bottom: 40px;
  line-height: 1.4;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  border: 2px solid #E0E0E0;
  border-radius: 10px;
  padding: 2px;
  transition: all 0.25s ease;
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
}

.input-group.checking {
  border-color: #ffd84d;
}

.input-group input {
  width: 100%;
  padding: 16px;
  font-size: 1.1rem;
  border: none;
  outline: none;
  background: transparent;
  color: #1A1A1A;
}

.input-group input:disabled {
  background-color: #f2f2f2;
  cursor: not-allowed;
}

.hint {
  font-size: 0.9rem;
  color: #555;
  min-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.25s;
}

.hint.error {
  color: #EB5757;
}

.hint.success {
  color: #27AE60;
}

.hint.warning {
  color: #ffd84d;
}

.btn {
  width: 100%;
  padding: 14px 0;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.25s;
  border-radius: 10px;
  margin-top: 10px;
  text-align: center;
}

.btn-primary {
  background-color: #E0E0E0;
  color: #BDBDBD;
}

.btn-primary.active {
  background-color: #ffd84d;
  color: #1A1A1A;
}

.btn-primary.active:hover:not(:disabled) {
  background-color: #e9c23f;
}

.btn-primary:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.spinner {
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.alert-error {
  margin-top: 20px;
  padding: 14px;
  background-color: rgba(235, 87, 87, 0.1);
  border: 1px solid #EB5757;
  border-radius: 10px;
  color: #EB5757;
  font-size: 0.9rem;
  text-align: center;
}

@media (max-width: 1024px) {
  .title {
    font-size: 2.3rem;
  }

  .input-group input {
    font-size: 1.4rem;
    padding: 20px;
  }

  .btn {
    font-size: 1.6rem;
    padding: 18px 0;
    border-radius: 14px;
  }

  .hint {
    font-size: 1.2rem;
  }
}
</style>
