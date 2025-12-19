import Pokedex from "../views/pokedexViews/Pokedex.vue";

export default [
    { path: '/pokedex/', name: 'Pokedex', component: Pokedex, meta: { requiresAuth: true } },
    //{ path: '/pokedex/details/:pokemonId', name: 'PokemonDetails', component: PokemonDetails, meta: { requiresAuth: true }}
];