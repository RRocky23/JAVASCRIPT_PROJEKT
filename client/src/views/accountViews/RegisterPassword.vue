<template>
  <div class="register-password">
    <div class="header">
      <button class="back-btn" @click="goBack">‹</button>
      <div class="header-title">Create account</div>
      <div class="header-spacer"></div>
    </div>

    <div class="content">
      <div class="title">
        And now<br />a password:
      </div>

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

        <button 
          type="submit" 
          class="btn btn-primary" 
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

const isValid = computed(() => {
  return password.value.length >= 8 && 
         password.value.length <= 30 &&
         /(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(password.value);
});

const hintMessage = computed(() => {
  if (!password.value) {
    return 'MAKE IT STRONG LIKE TAUROS';
  }
  if (password.value.length < 8) {
    return 'DID YOU FORGET SOMETHING?';
  }
  if (hasError.value) {
    return 'DID YOU FORGET SOMETHING?';
  }
  if (isValid.value) {
    return "I WON'T TELL ANYONE";
  }
  return 'DID YOU FORGET SOMETHING?';
});

const validatePassword = () => {
  if (password.value.length > 0) {
    hasError.value = !isValid.value;
  } else {
    hasError.value = false;
  }
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
.register-password {
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
  font-size: 1.4rem;
  cursor: pointer;
  padding: 8px;
}

.header-title {
  font-size: 1.2rem;
  font-weight: bold;
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
  padding: 40px 24px;
  overflow-y: auto;
  align-items: center;
  text-align: center;
}

.title {
  font-size: 1.8rem;
  font-weight: 900;
  color: #1A1A1A;
  margin-bottom: 30px;
}

.form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  gap: 20px;
}

.input-group {
  position: relative;
  border: 2px solid #E0E0E0;
  border-radius: 10px;
  transition: border-color 0.2s, background-color 0.2s;
}

.input-group.focused {
  border-color: #1A1A1A;
}

.input-group.valid {
  border-color: #27AE60;
}

.input-group.error {
  border-color: #EB5757;
  background-color: rgba(235, 87, 87, 0.06);
}

.input-group input {
  width: 100%;
  padding: 16px;
  padding-right: 50px;
  font-size: 1rem;
  border: none;
  outline: none;
  background: transparent;
  border-radius: 10px;
}

.toggle-password {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.3rem;
}

.hint {
  font-size: 0.9rem;
  color: #4F4F4F;
  text-align: center;
  min-height: 18px;
}

.hint.error {
  color: #EB5757;
}

.hint.success {
  color: #27AE60;
}

.btn {
  width: 100%;
  padding: 14px 0;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 10px;
}

.btn-primary {
  background-color: #E0E0E0;
  color: #BDBDBD;
}

.btn-primary.active {
  background-color: #ffd84d;
  color: #1A1A1A;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .title {
    font-size: 2.4rem;
  }

  .back-btn {
    font-size: 2rem;
  }

  .header-title {
    font-size: 1.7rem;
  }

  .input-group input {
    padding: 22px;
    font-size: 1.4rem;
  }

  .toggle-password {
    font-size: 2rem;
  }

  .hint {
    font-size: 1.2rem;
  }

  .btn {
    font-size: 1.6rem;
    padding: 20px 0;
    border-radius: 14px;
  }

  .form {
    max-width: 90%;
  }
}
</style>
