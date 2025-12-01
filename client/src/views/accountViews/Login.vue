<template>
    <div class="login-big">
        <form method="post" @submit.prevent="handleSubmit">
            <h2 class="mb-4">Sign In</h2>

            <div class="mb-3 text-start">
                <label for="userIdentifier" class="form-label">User identifier</label>
                <input v-model="userModel.userIdentifier" type="text" id="userIdentifier" class="form-control login-input" placeholder="Enter your email or username" required :disabled="loading"/>
                <small v-if="fieldErrors.userIdentifier" class="text-danger">{{ fieldErrors.userIdentifier }}</small>
            </div>

            <div class="mb-4 text-start">
                <label for="password" class="form-label">Password</label>
                <input v-model="userModel.password" type="password" id="password" class="form-control login-input" placeholder="Enter your password" required :disabled="loading"/>
                <small v-if="fieldErrors.password" class="text-danger">{{ fieldErrors.password }}</small>
            </div>

            <div class="mb-4 text-start">
                <div class="form-check login-check">
                    <input v-model="userModel.rememberMe" type="checkbox" id="rememberMe" class="form-check-input" :disabled="loading"/>
                    <label for="rememberMe" class="form-check-label">Remember me</label>
                </div>
            </div>

            <div v-if="generalError" class="alert alert-danger mt-3" role="alert">
                {{ generalError }}
            </div>

            <div class="d-flex justify-content-between mt-4 login-buttons">
                <router-link to="/home" class="btn btn-secondary flex-grow-1 me-2 login-button" :disabled="loading">Cancel</router-link>
                <button type="submit" class="btn btn-primary flex-grow-1 ms-2 login-button" :disabled="loading">Sign In</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from "vue-router";
import { useAuth } from "../../composables/useAuth.js";

const router = useRouter();
const { login, loading } = useAuth();

const userModel = reactive({
    userIdentifier: '',
    password: '',
    rememberMe: false
});

const fieldErrors = reactive({});
const generalError = ref("");

const handleSubmit = async () => {
    Object.keys(fieldErrors).forEach(key => delete fieldErrors[key]);
    generalError.value = "";

    try {
        await login(userModel.userIdentifier, userModel.password, userModel.rememberMe);
        router.push("/home");
    } 
    catch(err) {
        const { response } = err;
    
        if(!response) {
            generalError.value = "Network error, please try again.";
            return;
        }

        if(response.status === 500) {
            router.push({ path: "/error", query: { status: 500, message: "Internal server error" } });
            return;
        }

        if(response.data?.errors) {
            Object.assign(fieldErrors, response.data.errors);
        } 
        else if(response.data?.message) {
            generalError.value = response.data.message;
        } 
        else {
            generalError.value = "Something went wrong.";
        }
    }
};
</script>

<style scoped>
/* normal desktop */
.login-big {
    max-width: 450px;
    width: 100%;
    background: rgba(255,255,255,0.9);
    border-radius: 18px;
    padding: 30px 25px;
}

/* MOBILE — gigant */
@media (max-width: 1024px) {

  .login-big {
    max-width: 100vw !important;
    width: 100vw !important;
    border-radius: 0 !important;
    padding: 40px !important;
    font-size: 1.4rem !important;
  }

  h2 {
    font-size: 2.4rem !important;
    font-weight: 900;
  }

  .login-input {
    font-size: 1.4rem !important;
    padding: 16px !important;
    height: 56px !important;
  }

  .login-check label {
    font-size: 1.4rem !important;
  }

  .login-buttons .login-button {
    font-size: 1.6rem !important;
    padding: 18px 26px !important;
    height: 60px !important;
  }
}
</style>
