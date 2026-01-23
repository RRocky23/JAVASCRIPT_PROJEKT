<template>
    <div class="pokedex-page">
        <Header :header-title="`${friendName}'s Pokemon`"/>

        <div class="content">
            <Spinner v-if="loading" />

            <div v-else-if="friendPokemon.length === 0" class="empty-message">
                This friend has no Pokemon yet.
            </div>

                    <div v-else class="pokemon-list-container">
                <div class="pokemon-grid">
                    <div
                        v-for="pokemon in friendPokemon"
                        :key="pokemon._id"
                        @click="selectPokemonForTrade(pokemon)"
                        class="pokemon-card"
                    >
                        <img
                            :src="getSprite(pokemon)"
                            :alt="getName(pokemon)"
                            class="pokemon-sprite"
                        />
                        <div class="pokemon-name">{{ getName(pokemon) }}</div>
                        <div class="pokemon-level">Level {{ pokemon.level }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Trade Modal -->
        <div v-if="showTradeModal" class="modal-overlay" @click="closeTradeModal">
            <div class="modal-content" @click.stop>
                <h3>Propose Trade</h3>
                <p>You want: {{ selectedFriendPokemon?.pokemonId.name }}</p>

                <div class="trade-section">
                    <h4>Select your Pokemon to offer:</h4>
                    <div v-if="selectedFriendPokemon" class="selected-friend-pokemon">
                        <img :src="getSprite(selectedFriendPokemon)" :alt="getName(selectedFriendPokemon)" class="selected-friend-sprite" />
                        <div class="selected-friend-name">{{ getName(selectedFriendPokemon) }}</div>
                    </div>
                    <div v-if="loadingMyPokemon" class="loading-text">Loading...</div>
                    <div v-else-if="myPokemon.length === 0" class="empty-text">
                        You have no Pokemon to trade
                    </div>
                    <div v-else class="my-pokemon-list">
                        <div
                            v-for="pokemon in myPokemon"
                            :key="pokemon._id"
                            @click="selectMyPokemon(pokemon)"
                            :class="['pokemon-select-card', { selected: selectedMyPokemon?._id === pokemon._id }]"
                        >
                            <img
                                :src="getSprite(pokemon)"
                                :alt="getName(pokemon)"
                                class="small-sprite"
                            />
                            <div>
                                <div class="small-name">{{ getName(pokemon) }}</div>
                                <div class="small-level">Lvl {{ pokemon.level }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <button
                        @click="sendTrade"
                        :disabled="!selectedMyPokemon"
                        class="btn btn-primary"
                    >
                        Send Trade Request
                    </button>
                    <button @click="closeTradeModal" class="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </div>
        </div>

        <BottomNavigation/>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../../composables/useAuth.js';
import axiosInstance from '../../utils/axios.js';
import Header from '../../components/common/Header.vue';
import Spinner from '../../components/common/Spinner.vue';
import BottomNavigation from './BottomNavigation.vue';

const { isLoggedIn } = useAuth();
const router = useRouter();
const route = useRoute();

const friendId = route.params.id;
const friendName = ref('Friend');
const friendPokemon = ref([]);
const myPokemon = ref([]);
const nameCache = ref({}); // cache by user-pokemon _id or pokedex id
const loading = ref(true);
const loadingMyPokemon = ref(false);
const showTradeModal = ref(false);
const selectedFriendPokemon = ref(null);
const selectedMyPokemon = ref(null);

onMounted(async () => {
    if (!isLoggedIn.value) {
        router.push('/starter/onboarding4');
        return;
    }

    await loadFriendPokemon();
});

const loadFriendPokemon = async () => {
    try {
        const response = await axiosInstance.get(`/api/friends/${friendId}/pokemon`);
        friendPokemon.value = response.data;

        // Get friend name from first Pokemon if available
        if (friendPokemon.value.length > 0) {
            // We don't have friend name in the response, so we'll keep it as "Friend"
            // You could add an additional API call to get friend details if needed
        }
    } catch (error) {
        console.error('Error loading friend Pokemon:', error);
        alert(error.response?.data?.error || 'Failed to load Pokemon');
        router.push('/profile/friends');
    } finally {
        loading.value = false;
        // fetch species names for numeric entries
        fetchNamesForList(friendPokemon.value);
    }
};

const selectPokemonForTrade = async (pokemon) => {
    selectedFriendPokemon.value = pokemon;
    showTradeModal.value = true;
    loadingMyPokemon.value = true;

    try {
        const response = await axiosInstance.get('/api/pokedex/getUserPokemons/');
        myPokemon.value = response.data;
    } catch (error) {
        console.error('Error loading my Pokemon:', error);
    } finally {
        loadingMyPokemon.value = false;
        fetchNamesForList(myPokemon.value);
    }
};

const selectMyPokemon = (pokemon) => {
    selectedMyPokemon.value = pokemon;
};

const sendTrade = async () => {
    if (!selectedMyPokemon.value || !selectedFriendPokemon.value) {
        return;
    }

    try {
        await axiosInstance.post('/api/friends/trade/request', {
            toUserId: friendId,
            fromPokemonId: selectedMyPokemon.value._id,
            toPokemonId: selectedFriendPokemon.value._id
        });

        alert('Trade request sent successfully!');
        closeTradeModal();
    } catch (error) {
        alert(error.response?.data?.error || 'Failed to send trade request');
    }
};

const closeTradeModal = () => {
    showTradeModal.value = false;
    selectedFriendPokemon.value = null;
    selectedMyPokemon.value = null;
    myPokemon.value = [];
};

const getSprite = (p) => {
    if (!p) return '/placeholder-pokemon.png';
    const pid = p.pokemonId;
    if (!pid) return p.customSprite || '/placeholder-pokemon.png';
    if (typeof pid === 'object') {
        return pid.sprite || p.customSprite || '/placeholder-pokemon.png';
    }
    if (typeof pid === 'number' || !isNaN(Number(pid))) {
        const id = Number(pid);
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/${id}.png`;
    }
    return '/placeholder-pokemon.png';
};

const getName = (p) => {
    if (!p) return '';
    const pid = p.pokemonId;
    // prefer cached resolved name by user-pokemon id
    if (p._id && nameCache.value[p._id]) return nameCache.value[p._id];
    if (!pid) return p.customName || '';
    if (typeof pid === 'object') {
        return pid.name || p.customName || '';
    }
    if (typeof pid === 'number' || !isNaN(Number(pid))) {
        // check cache by pokedex id
        const num = Number(pid);
        if (nameCache.value[`pokedex_${num}`]) return nameCache.value[`pokedex_${num}`];
        return p.customName || `#${pid}`;
    }
    return p.customName || '';
};

// Fetch species names from PokeAPI for numeric pokemonId entries and store in cache
const fetchPokemonName = async (pokedexId) => {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokedexId}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.name || null;
    } catch (e) {
        return null;
    }
};

const fetchNamesForList = async (list) => {
    if (!Array.isArray(list)) return;
    const tasks = list.map(async (p) => {
        const pid = p.pokemonId;
        if (!pid) return;
        if (typeof pid === 'object') {
            // already has name populated
            if (p._id && pid.name) nameCache.value[p._id] = pid.name;
            return;
        }
        const num = Number(pid);
        if (isNaN(num)) return;
        // fetch by pokedex id
        const name = await fetchPokemonName(num);
        if (name) {
            // cache both by pokedex id and by user-pokemon id if available
            nameCache.value[`pokedex_${num}`] = name;
            if (p._id) nameCache.value[p._id] = name;
        }
    });
    await Promise.all(tasks);
};
</script>

<style scoped>
@import '../client/src/styles/FriendPokemonStyles.css';
</style>
