<template>
    <div class="text-center p-4 shadow-lg box-opaque">
        <form method="post" @submit.prevent="handleSubmit">
            <h2 class="mb-4">Sign Up</h2>

            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="name" class="form-label">Name</label>
                    <input v-model="userModel.name" type="text" id="name" class="form-control" placeholder="Enter your name" required />
                    <small v-if="fieldErrors.name" class="text-danger">{{ fieldErrors.name }}</small>
                </div>
                <div class="col-md-6">
                    <label for="surname" class="form-label">Surname</label>
                    <input v-model="userModel.surname" type="text" id="surname" class="form-control" placeholder="Enter your surname" required />
                    <small v-if="fieldErrors.surname" class="text-danger">{{ fieldErrors.surname }}</small>
                </div>
            </div>

            <div class="mb-3 text-start">
                <label for="username" class="form-label">Username</label>
                <input v-model="userModel.username" type="text" id="username" class="form-control" placeholder="Enter your username" required />
                <small v-if="fieldErrors.username" class="text-danger">{{ fieldErrors.username }}</small>
            </div>

            <div class="mb-3 text-start">
                <label for="birthdate" class="form-label">Birth Date</label>
                <input v-model="userModel.birthDate" type="date" id="birthdate" class="form-control" required />
                <small v-if="fieldErrors.birthDate" class="text-danger">{{ fieldErrors.birthDate }}</small>
            </div>

            <div class="mb-3 text-start">
                <label for="email" class="form-label">Email</label>
                <input v-model="userModel.email" type="email" id="email" class="form-control" placeholder="Enter your email" required />
                <small v-if="fieldErrors.email" class="text-danger">{{ fieldErrors.email }}</small>
            </div>

            <div class="mb-4 text-start">
                <label for="password" class="form-label">Password</label>
                <input v-model="userModel.password" type="password" id="password" class="form-control" placeholder="Enter your password" required />
                <small v-if="fieldErrors.password" class="text-danger">{{ fieldErrors.password }}</small>
            </div>

            <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
                {{ generalError }}
            </div>

            <div class="d-flex justify-content-between mt-3">
                <router-link to="/home" class="btn btn-secondary flex-grow-1 me-2">Cancel</router-link>
                <button type="submit" class="btn btn-primary flex-grow-1 ms-2">Sign Up</button>
            </div>
        </form>
    </div>
</template>

<script setup>
    import { ref, reactive } from "vue";
    import { useRouter } from "vue-router";
    import axios from "../../api/axios.js";

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
        fieldErrors.value = {};
        generalError.value = "";

        try {
            const response = await axios.post("/api/account/register", userModel);
            console.log("Registered:", response.data);
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

            if(response.data?.fieldErrors) {
                Object.assign(fieldErrors, response.data.fieldErrors);
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
    .box-opaque {
        background-color: rgba(255, 255, 255, 0.85);
        border-radius: 20px;
    }

    button.btn {
        transition: transform 0.2s;
    }

    button.btn:hover {
        transform: scale(1.05);
    }
</style>