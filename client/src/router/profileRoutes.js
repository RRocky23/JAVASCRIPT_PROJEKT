import Profile from "../views/profileViews/Profile.vue";
import Favourites from "../views/profileViews/Favourites.vue";
import MyPokemons from "../views/profileViews/MyPokemons.vue";
import Exchange from "../views/profileViews/Exchange.vue";
// import PokemonDetail from "../views/profileViews/PokemonDetail.vue";

export default [
    { 
        path: '/profile', 
        name: 'Profile', 
        component: Profile,
        meta: { requiresAuth: true }
    },
    { 
        path: '/profile/myPokemons', 
        name: 'MyPokemons', 
        component: MyPokemons,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/favourites',
        name: 'Favourites',
        component: Favourites,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/exchange',
        name: 'Exchange',
        component: Exchange,
        meta: { requiresAuth: true }
    },
    // {
    //     path: '/profile/pokedex/:id',
    //     name: 'PokemonDetail',
    //     component: PokemonDetail,
    //     meta: { requiresAuth: true }
    // }
];