import { ref, computed } from 'vue';
import axiosInstance from '../utils/axios.js';
import * as tokenService from '../utils/tokenService.js';

const accessToken = ref(tokenService.getAccessToken());
const user = ref(null);
const loading = ref(false);

export function useAuth() {
    const isLoggedIn = computed(() => !!accessToken.value);
    const isAdmin = computed(() => user.value?.role === 'admin');

    const fetchUser = async () => {
        try {
            const res = await axiosInstance.get('/api/profile/');
            user.value = res.data;
            return user.value;
        } 
        catch(err) {
            user.value = null;
            return null;
        }
    };

    const login = async (identifier, password, rememberMe = false) => {
        loading.value = true;
        
        try {
            const res = await axiosInstance.post('/api/account/login/', {
                userIdentifier: identifier,
                password,
                rememberMe
            });

            const token = res.data.accessToken;
            accessToken.value = token;
            tokenService.setAccessToken(token, rememberMe);

            await fetchUser();

            loading.value = false;
            return true;
        } 
        catch (err) {
            loading.value = false;
            throw err;
        }
    };

    const refresh = async () => {
        try {
            const res = await axiosInstance.post('/api/account/refresh/', {}, { 
                withCredentials: true 
            });
            const token = res.data.accessToken;
            accessToken.value = token;

            tokenService.setAccessToken(token, true);
            return token;
        } 
        catch (err) {
            await logout();
            return null;
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/api/account/logout/');
        } 
        catch(err) {
            console.error('Logout error:', err);
        }

        accessToken.value = null;
        user.value = null;
        tokenService.removeAccessToken();
        window.location.href = '/starter/onboarding1';
    };

    return {
        accessToken,
        user,
        loading,
        isLoggedIn,
        isAdmin,
        login,
        logout,
        refresh,
        fetchUser
    };
}