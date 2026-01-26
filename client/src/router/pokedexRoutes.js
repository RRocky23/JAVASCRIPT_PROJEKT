import Pokedex from "../views/pokedexViews/Pokedex.vue";
import PokemonDetails from "../views/pokemonDetails/PokemonDetails.vue";

export default [
    { path: '/pokedex/', name: 'Pokedex', component: Pokedex, meta: { requiresAuth: true } },
    { path: '/pokedex/details/:pokemonId', name: 'PokemonDetails', component: PokemonDetails, meta: { requiresAuth: true } }
];