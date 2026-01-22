<template>
    <div class="pokedex-page">
        <Header header-title="Friends"/>

        <div class="content friends-container">
            <!-- Search Users -->
            <div class="search-section">
                <h3>Search Users</h3>
                <div class="search-box">
                    <input
                        v-model="searchQuery"
                        @input="handleSearch"
                        type="text"
                        placeholder="Search by username..."
                        class="form-control"
                    />
                </div>
                <div v-if="searchResults.length > 0" class="search-results">
                    <div v-for="user in searchResults" :key="user._id" class="user-item">
                        <span>{{ user.username }} (Level {{ user.level }})</span>
                        <button @click="sendFriendRequest(user._id)" class="btn btn-sm btn-primary">
                            Add Friend
                        </button>
                    </div>
                </div>
            </div>

            <!-- Friend Requests -->
            <div class="section">
                <h3>Friend Requests ({{ friendRequests.length }})</h3>
                <div v-if="friendRequests.length === 0" class="empty-message">
                    No pending friend requests
                </div>
                <div v-else class="user-list">
                    <div v-for="user in friendRequests" :key="user._id" class="user-item">
                        <span>{{ user.username }} (Level {{ user.level }})</span>
                        <div class="action-buttons">
                            <button @click="acceptRequest(user._id)" class="btn btn-sm btn-success">
                                Accept
                            </button>
                            <button @click="rejectRequest(user._id)" class="btn btn-sm btn-danger">
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Friends List -->
            <div class="section">
                <h3>My Friends ({{ friends.length }})</h3>
                <div v-if="friends.length === 0" class="empty-message">
                    No friends yet. Search for users to add them!
                </div>
                <div v-else class="user-list">
                    <div v-for="user in friends" :key="user._id" class="user-item">
                        <span>{{ user.username }} (Level {{ user.level }})</span>
                        <div class="action-buttons">
                            <button @click="viewPokemon(user._id)" class="btn btn-sm btn-info">
                                View Pokemon
                            </button>
                            <button @click="removeFriend(user._id)" class="btn btn-sm btn-danger">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Trade Requests -->
            <div class="section">
                <h3>Trade Requests ({{ tradeRequests.length }})</h3>
                <div v-if="tradeRequests.length === 0" class="empty-message">
                    No pending trade requests
                </div>
                <div v-else class="trade-list">
                    <div v-for="trade in tradeRequests" :key="trade._id" class="trade-item">
                        <div class="trade-info">
                            <div v-if="trade.fromUser._id === currentUserId">
                                <p><strong>To:</strong> {{ trade.toUser.username }}</p>
                                <p><strong>Your Pokemon:</strong> {{ trade.fromPokemon.pokemonId.name }}</p>
                                <p><strong>For:</strong> {{ trade.toPokemon.pokemonId.name }}</p>
                                <p class="status-text">Waiting for response...</p>
                            </div>
                            <div v-else>
                                <p><strong>From:</strong> {{ trade.fromUser.username }}</p>
                                <p><strong>They offer:</strong> {{ trade.fromPokemon.pokemonId.name }}</p>
                                <p><strong>For your:</strong> {{ trade.toPokemon.pokemonId.name }}</p>
                                <div class="action-buttons">
                                    <button @click="acceptTrade(trade._id)" class="btn btn-sm btn-success">
                                        Accept
                                    </button>
                                    <button @click="rejectTrade(trade._id)" class="btn btn-sm btn-danger">
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <BottomNavigation/>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth.js';
import axiosInstance from '../../utils/axios.js';
import Header from '../../components/common/Header.vue';
import BottomNavigation from './BottomNavigation.vue';

const { isLoggedIn, fetchUser } = useAuth();
const router = useRouter();

const searchQuery = ref('');
const searchResults = ref([]);
const friends = ref([]);
const friendRequests = ref([]);
const tradeRequests = ref([]);
const currentUserId = ref(null);
let searchTimeout = null;

onMounted(async () => {
    if (!isLoggedIn.value) {
        router.push('/starter/onboarding4');
        return;
    }

    try {
        const currentUser = await fetchUser();
        if (!currentUser) {
            console.error('User data not found');
            router.push('/starter/onboarding4');
            return;
        }
        currentUserId.value = currentUser._id;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/starter/onboarding4');
        return;
    }

    await loadFriends();
    await loadFriendRequests();
    await loadTradeRequests();
});

const handleSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        if (searchQuery.value.trim().length === 0) {
            searchResults.value = [];
            return;
        }

        try {
            const response = await axiosInstance.get(`/api/friends/search?q=${searchQuery.value}`);
            searchResults.value = response.data;
        } catch (error) {
            console.error('Search error:', error);
        }
    }, 300);
};

const loadFriends = async () => {
    try {
        const response = await axiosInstance.get('/api/friends/');
        friends.value = response.data;
    } catch (error) {
        console.error('Error loading friends:', error);
    }
};

const loadFriendRequests = async () => {
    try {
        const response = await axiosInstance.get('/api/friends/requests');
        friendRequests.value = response.data;
    } catch (error) {
        console.error('Error loading friend requests:', error);
    }
};

const loadTradeRequests = async () => {
    try {
        const response = await axiosInstance.get('/api/friends/trade/requests');
        tradeRequests.value = response.data;
    } catch (error) {
        console.error('Error loading trade requests:', error);
    }
};

const sendFriendRequest = async (userId) => {
    try {
        await axiosInstance.post('/api/friends/request', { userId });
        alert('Friend request sent!');
        searchResults.value = searchResults.value.filter(u => u._id !== userId);
    } catch (error) {
        alert(error.response?.data?.error || 'Failed to send friend request');
    }
};

const acceptRequest = async (userId) => {
    try {
        await axiosInstance.post(`/api/friends/request/${userId}/accept`);
        await loadFriendRequests();
        await loadFriends();
    } catch (error) {
        alert(error.response?.data?.error || 'Failed to accept request');
    }
};

const rejectRequest = async (userId) => {
    try {
        await axiosInstance.post(`/api/friends/request/${userId}/reject`);
        await loadFriendRequests();
    } catch (error) {
        alert(error.response?.data?.error || 'Failed to reject request');
    }
};

const removeFriend = async (userId) => {
    if (!confirm('Are you sure you want to remove this friend?')) {
        return;
    }

    try {
        await axiosInstance.delete(`/api/friends/${userId}`);
        await loadFriends();
    } catch (error) {
        alert(error.response?.data?.error || 'Failed to remove friend');
    }
};

const viewPokemon = (userId) => {
    router.push(`/profile/friends/${userId}/pokemon`);
};

const acceptTrade = async (tradeId) => {
    try {
        await axiosInstance.post(`/api/friends/trade/${tradeId}/accept`);
        alert('Trade completed successfully!');
        await loadTradeRequests();
    } catch (error) {
        alert(error.response?.data?.error || 'Failed to accept trade');
    }
};

const rejectTrade = async (tradeId) => {
    try {
        await axiosInstance.post(`/api/friends/trade/${tradeId}/reject`);
        await loadTradeRequests();
    } catch (error) {
        alert(error.response?.data?.error || 'Failed to reject trade');
    }
};
</script>

<style scoped>
@import '../client/src/styles/FriendsStyles.css';
</style>