<template>
  <div class="map-container">
    <div v-if="!isInsideBoundary" class="out-of-bounds-warning">
      <div>You're outside the game area!</div>
      <button @click="openGoogleMaps" class="navigate-btn">
        Navigate to Campus
      </button>
    </div>

    <div v-if="geolocationError" class="geo-error">{{ geolocationError }}</div>

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

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuth } from '../composables/useAuth.js';
import { getDistance } from 'geolib';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';

import BottomNav from '../components/Buttons/BottomNav.vue';

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
const accuracyCircle = ref(null);
const pokemonMarkers = ref(new Map());
const geolocationError = ref(null);

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
  map.value = L.map(mapElement.value).setView(userLocation.value, 25);

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

  if (playerMarker.value) playerMarker.value.setLatLng([lat, lng]);
  if (map.value) map.value.setView([lat, lng], map.value.getZoom());
  if (accuracyCircle.value) accuracyCircle.value.setLatLng([lat, lng]);

  isInsideBoundary.value = isPointInPolygon([lat, lng], GAME_AREA);

  const radius = accuracyCircle.value ? accuracyCircle.value.getRadius() : 100;
  pokemon.value.forEach(p => {
    const distance = getDistance(
        { latitude: lat, longitude: lng },
        { latitude: p.lat, longitude: p.lng }
    );

    if (p.caughtBy?.includes(userId.value)) {
      removePokemonMarker(p.id);
      return;
    }

    if (distance <= radius) {
      if (!pokemonMarkers.value.has(p.id)) addPokemonMarker(p);
    } 
    else {
      removePokemonMarker(p.id);
    }
  });

  if (socket.value && isInsideBoundary.value) {
    socket.value.emit('player:move', { lat, lng });
  }
};

const addPokemonMarker = (pokemonData) => {
  const marker = L.marker([pokemonData.lat, pokemonData.lng], {
    icon: createPokemonIcon(pokemonData.sprite[0])
  }).addTo(map.value);

  marker.on('click', () => {
    if (isInsideBoundary.value) {
      selectedPokemon.value = pokemonData;
    } 
    else {
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
    ballType: 'poke',
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
  const { fetchUser, user: authUser } = useAuth();
  await fetchUser();
  
  if(authUser.value) {
    userId.value = authUser.value._id;
    userAvatar.value = authUser.value.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.value.username}`;
  }

  initMap();

  socket.value = io("http://localhost:8000/", { transports: ['websocket', 'polling'] });

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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updatePlayerPosition(latitude, longitude);
        geolocationError.value = null;
      },
      (error) => {
        geolocationError.value = `Geolocation error: ${error.message || error.code}`;
        console.error('Geolocation getCurrentPosition error:', error);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    // Then start watching position
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
        updatePlayerPosition(GAME_CENTER[0], GAME_CENTER[1]);

        const inside = isPointInPolygon(GAME_CENTER, GAME_AREA);
        isInsideBoundary.value = inside;

        if (socket.value && inside) {
          socket.value.emit('player:move', { lat: GAME_CENTER[0], lng: GAME_CENTER[1] });
        }

        geolocationError.value = `Geolocation watch error: ${error.message || error.code}`;
        console.error('Geolocation watch error:', error);
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
@import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400;600&display=swap');

.map-container {
  position: relative;
  height: 100vh;
  width: 100%;
}

#map {
  height: 100%;
  width: 100%;
}

.out-of-bounds-warning {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: #FF5252;
  color: white;
  padding: 15px 25px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  font-family: "Kode Mono", monospace;
  font-weight: 600;
  text-align: center;
}

.navigate-btn {
  margin-top: 10px;
  background: white;
  color: #FF5252;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-family: "Kode Mono", monospace;
  font-weight: 600;
  cursor: pointer;
}

.catch-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.catch-modal-content {
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  font-family: "Kode Mono", monospace;
}

.catch-modal-content h3 {
  margin: 0 0 20px 0;
  font-size: 1.8rem;
  color: #1A1A1A;
}

.pokemon-sprite {
  width: 120px;
  height: 120px;
  image-rendering: pixelated;
  margin: 10px 0;
}

.pokemon-info {
  margin: 15px 0;
}

.pokemon-info p {
  margin: 5px 0;
  font-size: 1rem;
}

.catch-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-catch,
.btn-cancel {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-family: "Kode Mono", monospace;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-catch {
  background: #FEC41B;
  color: white;
}

.btn-catch:hover:not(:disabled) {
  background: #e0b017;
}

.btn-catch:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: #E0E0E0;
  color: #1A1A1A;
}

.btn-cancel:hover {
  background: #BDBDBD;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 20px;
  background-color: #fff;
  border-top: 1px solid #E0E0E0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  min-width: 60px;
}

.nav-icon {
  font-size: 1.5rem;
  transition: transform 0.2s;
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
}

.nav-label {
  font-family: "Kode Mono", monospace;
  font-size: 0.75rem;
  color: #1A1A1A;
  font-weight: 600;
}

.nav-item.active .nav-label {
  color: #FEC41B;
}

.nav-item.active .nav-icon {
  filter: drop-shadow(0 2px 4px rgba(254, 196, 27, 0.3));
}

.geo-error {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1100;
  background: rgba(0,0,0,0.75);
  color: #FFDADA;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: "Kode Mono", monospace;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .nav-icon {
    font-size: 1.8rem;
  }

  .nav-label {
    font-size: 0.9rem;
  }

  .bottom-nav {
    padding: 16px 20px;
  }
}
</style>