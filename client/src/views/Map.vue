<template>
  <div class="map-container">
    <div v-if="!isInsideBoundary" class="out-of-bounds-warning">
      <div>You're outside the game area!</div>
      <button @click="openGoogleMaps" class="navigate-btn">
        Navigate to Campus
      </button>
    </div>

    <div id="map" ref="mapElement"></div>

    <div v-if="selectedPokemon" class="catch-modal">
      <div class="catch-modal-content">
        <h3>{{ selectedPokemon.name }}</h3>
        <img :src="selectedPokemon.sprite[0]" alt="Pokemon" class="pokemon-sprite" />
        <div class="pokemon-info">
          <p>Level: {{ selectedPokemon.level }}</p>
          <p>Types: {{ selectedPokemon.types.join(', ') }}</p>
        </div>
        <div class="catch-buttons">
          <button @click="catchPokemon" :disabled="catchingPokemon" class="btn-catch">
            {{ catchingPokemon ? 'Catching...' : 'Catch!' }}
          </button>
          <button @click="selectedPokemon = null" class="btn-cancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  <BottomNav />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth.js';
import { getDistance } from 'geolib';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import BottomNav from '../components/buttons/BottomNav.vue';

const GAME_AREA = [
  [53.12104877931438, 23.14610872616234],
  [53.120655965356804, 23.14581312336938],
  [53.12054192192244, 23.145538635061456],
  [53.11979429636037, 23.14486297153414],
  [53.11874252991319, 23.144313994918292],
  [53.1174246175604, 23.14427176594694],
  [53.116575556473975, 23.144609597711252],
  [53.11537163514393, 23.145475291605067],
  [53.114332433835415, 23.14619318410243],
  [53.11331855469393, 23.14691107660107],
  [53.11267219426267, 23.147312251820438],
  [53.11278625857426, 23.147840113951275],
  [53.113014386289365, 23.148283518140744],
  [53.11353400601175, 23.148959181668033],
  [53.11439580048773, 23.150120478354836],
  [53.11636012039651, 23.15267533106754],
  [53.11805823431126, 23.154829008560938],
  [53.1186664976064, 23.155673587969687],
  [53.11912268942979, 23.15643370943843],
  [53.11935078352633, 23.15643370943843],
  [53.119528189208864, 23.15584250385257],
  [53.11970559415931, 23.153794398784328],
  [53.1199717002126, 23.150922828793597],
  [53.12016177495647, 23.14906475409441],
  [53.120415206640644, 23.14781899946496],
  [53.120668636830715, 23.14705887799755],
  [53.12104877931438, 23.14610872616234]
];

const GAME_CENTER = [53.11777280377714, 23.149635100476814];

const mapElement = ref(null);
const map = ref(null);
const userLocation = ref(GAME_CENTER);
const pokemon = ref([]);
const socket = ref(null);
const isInsideBoundary = ref(true);
const selectedPokemon = ref(null);
const catchingPokemon = ref(false);
const userAvatar = ref('https://api.dicebear.com/7.x/avataaars/svg?seed=default');
const userId = ref(null);
const watchId = ref(null);
const playerMarker = ref(null);
const accuracyCircle = ref(null)
const pokemonMarkers = ref(new Map());

const isPointInPolygon = (point, polygon) => {
  const [lat, lng] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect =
      yi > lng !== yj > lng &&
      lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
};

const createPokemonIcon = (sprite) => {
  return L.divIcon({
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 3px solid #FEC41B;
      ">
        <img src="${sprite}" style="width: 32px; height: 32px; image-rendering: pixelated;" />
      </div>
    `,
    className: 'pokemon-marker',
    iconSize: [60, 60],
    iconAnchor: [30, 30],
  });
};

const createPlayerIcon = (avatarUrl) => {
  return L.divIcon({
    html: `
      <div style="
        width: 50px;
        height: 50px;
        background: #4CAF50;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 10px rgba(0,0,0,0.4);
        border: 4px solid white;
      ">
        <img src="${avatarUrl}" style="width: 42px; height: 42px; border-radius: 50%;" />
      </div>
    `,
    className: 'player-marker',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });
};

const initMap = () => {
  map.value = L.map(mapElement.value).setView(userLocation.value, 30);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value);

  L.polygon(GAME_AREA, {
    color: '#FEC41B',
    weight: 3,
    fillColor: '#FEC41B',
    fillOpacity: 0.1,
  }).addTo(map.value);

  playerMarker.value = L.marker(userLocation.value, {
    icon: createPlayerIcon(userAvatar.value)
  }).addTo(map.value).bindPopup('You are here');

  accuracyCircle.value = L.circle(userLocation.value, {
    radius: 100,
    color: '#4CAF50',
    fillColor: '#4CAF50',
    fillOpacity: 0.2,
  }).addTo(map.value);
};

const updatePlayerPosition = (lat, lng) => {
  userLocation.value = [lat, lng];
  
  if(map.value) {
    map.value.setView([lat, lng], 30);
  }
  
  if(playerMarker.value) {
    playerMarker.value.setLatLng([lat, lng]);
  }

  if(accuracyCircle.value) {
    accuracyCircle.value.setLatLng([lat, lng]);
  }

  const radius = accuracyCircle.value ? accuracyCircle.value.getRadius() : 100;
  pokemon.value.forEach(p => {
    const distance = getDistance({ latitude: lat, longitude: lng }, { latitude: p.lat, longitude: p.lng });

    if(p.caughtBy?.includes(userId.value)) {
      removePokemonMarker(p.id);
      return;
    }

    if(distance <= radius) {
      if(!pokemonMarkers.value.has(p.id)) {
        addPokemonMarker(p);
      }
    } 
    else {
      removePokemonMarker(p.id);
    }
  });
};

const addPokemonMarker = (pokemonData) => {
  const marker = L.marker([pokemonData.lat, pokemonData.lng], {
    icon: createPokemonIcon(pokemonData.sprite[0])
  }).addTo(map.value);

  marker.on('click', () => {
    if (isInsideBoundary.value) {
      selectedPokemon.value = pokemonData;
    } else {
      alert('You must be inside the game area to catch Pokemon!');
    }
  });

  marker.bindPopup(`
    <div style="text-align: center; font-family: 'Kode Mono', monospace;">
      <strong>${pokemonData.name}</strong>
      <div>Level: ${pokemonData.level}</div>
      <div>Types: ${pokemonData.types.join(', ')}</div>
      <div style="margin-top: 5px;">
        <em style="font-size: 0.85em;">Click to catch!</em>
      </div>
    </div>
  `);

  pokemonMarkers.value.set(pokemonData.id, marker);
};

const removePokemonMarker = (pokemonId) => {
  const marker = pokemonMarkers.value.get(pokemonId);
  if (marker) {
    map.value.removeLayer(marker);
    pokemonMarkers.value.delete(pokemonId);
  }
};

const updateVisiblePokemon = () => {
  if (!map.value || !accuracyCircle.value) return;
  const [lat, lng] = userLocation.value;

  pokemon.value.forEach(p => {
    const distance = getDistance(
        { latitude: lat, longitude: lng },
        { latitude: p.lat, longitude: p.lng }
    );

    if (p.caughtBy?.includes(userId.value)) {
      removePokemonMarker(p.id);
      return;
    }

    if (distance <= accuracyCircle.value.getRadius()) {
      if (!pokemonMarkers.value.has(p.id)) addPokemonMarker(p);
    } 
    else {
      removePokemonMarker(p.id);
    }
  });
};

const catchPokemon = async () => {
  if (!socket.value || catchingPokemon.value || !selectedPokemon.value) return;

  catchingPokemon.value = true;

  socket.value.emit('pokemon:catch', {
    pokemonId: selectedPokemon.value.id,
    userId: userId.value,
    ballType: 'poke-ball',
    catchLocation: { lat: userLocation.value[0], lng: userLocation.value[1] },
  });

  socket.value.once('pokemon:catch:success', ({ pokemon: caughtPokemon, isNewDiscovery }) => {
    alert(`Caught ${selectedPokemon.value.name}!${isNewDiscovery ? ' (New Discovery!)' : ''}`);
    removePokemonMarker(selectedPokemon.value.id);
    pokemon.value = pokemon.value.filter(p => p.id !== selectedPokemon.value.id);
    selectedPokemon.value = null;
    catchingPokemon.value = false;
  });

  socket.value.once('pokemon:catch:failed', ({ error }) => {
    alert(`Failed to catch: ${error}`);
    catchingPokemon.value = false;
  });
};

const openGoogleMaps = () => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${GAME_CENTER[0]},${GAME_CENTER[1]}`;
  window.open(url, '_blank');
};

onMounted(async () => {
  
  const router = useRouter();
  const { fetchUser, user: authUser, refresh } = useAuth();
  await fetchUser();
  if(authUser.value) {
    userId.value = authUser.value._id;
    userAvatar.value = authUser.value.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.value.username}`;
  }
  else {
    console.error('User data not found. Try to sign in');
    router.push('/starter/onboarding4');
  }

  initMap();

  const { protocol, hostname } = window.location;

  const socketUrl =
    hostname === 'localhost'
      ? `${protocol}//${hostname}:8000`
      : window.location.origin;

    console.log(socketUrl)

  socket.value = io(socketUrl, {
    transports: ['websocket', 'polling'],
  });

  socket.value.on('connect', () => {
    console.log('Connected to server');
    if (userId.value) {
      socket.value.emit('request:pokemon', userId.value);
    }
  });

  socket.value.on('pokemon:list', (pokemonList) => {
    pokemon.value = pokemonList;
    updateVisiblePokemon();
  });

  socket.value.on('pokemon:spawn', (newPokemon) => {
    pokemon.value.push(newPokemon);
    updateVisiblePokemon();
  });

  socket.value.on('pokemon:despawn', (pokemonId) => {
    removePokemonMarker(pokemonId);
    pokemon.value = pokemon.value.filter(p => p.id !== pokemonId);
  });

  if (navigator.geolocation) {
    watchId.value = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updatePlayerPosition(latitude, longitude);
        
        const inside = isPointInPolygon([latitude, longitude], GAME_AREA);
        isInsideBoundary.value = inside;

        if (socket.value && inside) {
          socket.value.emit('player:move', { lat: latitude, lng: longitude });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );
  }
});

onUnmounted(() => {
  if (socket.value) socket.value.disconnect();
  if (watchId.value) {
    navigator.geolocation.clearWatch(watchId.value);
  }
});
</script>

<style scoped>
@import '../client/src/styles/MapStyles.css';
</style>