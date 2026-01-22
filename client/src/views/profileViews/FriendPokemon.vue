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
.pokemon-list-container {
    padding: 20px;
    max-height: calc(100vh - 180px);
    overflow: auto;
    min-height: 0;
    padding-bottom: 140px;
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
}

.pokemon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
}

.pokemon-card {
    background: white;
    border-radius: 12px;
    padding: 15px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.pokemon-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.pokemon-sprite {
    width: 100px;
    height: 100px;
    object-fit: contain;
}

.pokemon-name {
    font-weight: bold;
    margin-top: 8px;
    text-transform: capitalize;
}

.pokemon-level {
    color: #666;
    font-size: 0.9rem;
    margin-top: 4px;
}

.empty-message {
    text-align: center;
    padding: 40px;
    color: #6c757d;
    font-size: 1.1rem;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 15px;
    padding: 30px;
    max-width: 600px;
    width: 90%;
    max-height: 85vh;
    overflow-y: auto;
}

.modal-content h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #333;
}

.modal-content h4 {
    margin: 20px 0 10px 0;
    color: #555;
    font-size: 1rem;
}

.trade-section {
    margin: 20px 0;
}

.my-pokemon-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 40vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.selected-friend-pokemon {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 12px;
}

.selected-friend-sprite {
    width: 64px;
    height: 64px;
    object-fit: contain;
}

.selected-friend-name {
    font-weight: 700;
    text-transform: capitalize;
    color: #333;
}

/* Visible, thin scrollbar similar to shop */
.modal-content::-webkit-scrollbar,
.my-pokemon-list::-webkit-scrollbar,
.pokemon-list-container::-webkit-scrollbar {
    width: 10px;
}

.modal-content::-webkit-scrollbar-thumb,
.my-pokemon-list::-webkit-scrollbar-thumb,
.pokemon-list-container::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.12);
    border-radius: 8px;
}

.modal-content { scrollbar-width: thin; }
.my-pokemon-list { scrollbar-width: thin; }
.pokemon-list-container { scrollbar-width: thin; }

.pokemon-select-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid transparent;
}

.pokemon-select-card:hover {
    background: #e9ecef;
}

.pokemon-select-card.selected {
    border-color: #FEC41B;
    background: #fff9e6;
}

.small-sprite {
    width: 50px;
    height: 50px;
    object-fit: contain;
}

.small-name {
    font-weight: bold;
    text-transform: capitalize;
}

.small-level {
    color: #666;
    font-size: 0.85rem;
}

.modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    justify-content: flex-end;
}

.loading-text, .empty-text {
    text-align: center;
    padding: 20px;
    color: #6c757d;
}

@media (max-width: 768px) {
    .pokemon-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 15px;
    }

    .modal-content {
        width: 95%;
        padding: 20px;
    }
}
</style>
