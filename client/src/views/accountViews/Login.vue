<template>
    <div class="text-center p-4 shadow-lg box-opaque">
        <form method="post" @submit.prevent="handleSubmit">
            <h2 class="mb-4">Sign In</h2>

            <div class="mb-3 text-start">
                <label for="userIdentifier" class="form-label">User identifier</label>
                <input v-model="userModel.username" type="text" id="userIdentifier" class="form-control" placeholder="Enter your email or username" required />
                <small v-if="fieldErrors.userIdentifier" class="text-danger">{{ fieldErrors.userIdentifier }}</small>
            </div>

            <div class="mb-4 text-start">
                <label for="password" class="form-label">Password</label>
                <input v-model="userModel.password" type="password" id="password" class="form-control" placeholder="Enter your password" required />
                <small v-if="fieldErrors.password" class="text-danger">{{ fieldErrors.password }}</small>
            </div>

            <div v-if="generalError" class="alert alert-danger mt-3" role="alert">
                {{ generalError }}
            </div>

            <div class="d-flex justify-content-between mt-3">
                <router-link to="/home" class="btn btn-secondary flex-grow-1 me-2">Cancel</router-link>
                <button type="submit" class="btn btn-primary flex-grow-1 ms-2">Sign In</button>
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
        userIdentifier: '',
        password: ''
    });

    const fieldErrors = reactive({});
    const generalError = ref("");

    const handleSubmit = async () => {
        Object.keys(fieldErrors).forEach(key => delete fieldErrors[key]);
        generalError.value = "";

        try {
            const response = await axios.post("/api/account/login", userModel);
            console.log("Login:", response.data);
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