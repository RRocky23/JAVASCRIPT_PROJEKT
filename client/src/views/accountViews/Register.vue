<template>
    <div class="register-big">
        <form method="post" @submit.prevent="handleSubmit">
            <h2 class="mb-4">Sign Up</h2>

            <div class="mb-3 text-start">
                <label for="name" class="form-label">Name</label>
                <input v-model="userModel.name" type="text" id="name" class="form-control reg-input" placeholder="Enter your name" required />
                <small v-if="fieldErrors.name" class="text-danger">{{ fieldErrors.name }}</small>
            </div>

            <div class="mb-3 text-start">
                <label for="surname" class="form-label">Surname</label>
                <input v-model="userModel.surname" type="text" id="surname" class="form-control reg-input" placeholder="Enter your surname" required />
                <small v-if="fieldErrors.surname" class="text-danger">{{ fieldErrors.surname }}</small>
            </div>

            <div class="mb-3 text-start">
                <label for="username" class="form-label">Username</label>
                <input v-model="userModel.username" type="text" id="username" class="form-control reg-input" placeholder="Enter your username" required />
                <small v-if="fieldErrors.username" class="text-danger">{{ fieldErrors.username }}</small>
            </div>

            <div class="mb-3 text-start">
                <label for="birthdate" class="form-label">Birth Date</label>
                <input v-model="userModel.birthDate" type="date" id="birthdate" class="form-control reg-input" required />
                <small v-if="fieldErrors.birthDate" class="text-danger">{{ fieldErrors.birthDate }}</small>
            </div>

            <div class="mb-3 text-start">
                <label for="email" class="form-label">Email</label>
                <input v-model="userModel.email" type="email" id="email" class="form-control reg-input" placeholder="Enter your email" required />
                <small v-if="fieldErrors.email" class="text-danger">{{ fieldErrors.email }}</small>
            </div>

            <div class="mb-4 text-start">
                <label for="password" class="form-label">Password</label>
                <input v-model="userModel.password" type="password" id="password" class="form-control reg-input" placeholder="Enter your password" required />
                <small v-if="fieldErrors.password" class="text-danger">{{ fieldErrors.password }}</small>
            </div>

            <div v-if="generalError" class="alert alert-danger mt-3" role="alert">
                {{ generalError }}
            </div>

            <div class="d-flex justify-content-between mt-4 reg-buttons">
                <router-link to="/home" class="btn btn-secondary flex-grow-1 me-2 reg-button">Cancel</router-link>
                <button type="submit" class="btn btn-primary flex-grow-1 ms-2 reg-button">Sign Up</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "../../utils/axios.js";

const router = useRouter();

const userModel = reactive({
    username: '',
    name: '',
    surname: '',
    birthDate: '',
    email: '',
    password: ''
});

const fieldErrors = reactive({});
const generalError = ref("");

const handleSubmit = async () => {
    Object.keys(fieldErrors).forEach(key => delete fieldErrors[key]);
    generalError.value = "";

    try {
        const response = await axios.post("/api/account/register", userModel);
        router.push("/account/login");
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
/* ----- DESKTOP ----- */
.register-big {
    max-width: 500px;
    width: 100%;
    background: rgba(255,255,255,0.9);
    border-radius: 18px;
    padding: 30px 25px;
}

.reg-input {
    font-size: 1rem;
    height: 38px;
}

.reg-button {
    font-size: 1rem;
    padding: 10px 14px;
}

/* ----- MOBILE GIANT MODE ----- */
@media (max-width: 1024px) {

  .register-big {
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

  .reg-input {
    font-size: 1.5rem !important;
    padding: 16px !important;
    height: 58px !important;
  }

  label {
    font-size: 1.4rem !important;
  }

  .reg-buttons .reg-button {
    font-size: 1.6rem !important;
    padding: 18px 26px !important;
    height: 64px !important;
  }
}
</style>
