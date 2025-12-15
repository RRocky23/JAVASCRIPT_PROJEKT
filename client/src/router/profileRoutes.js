import ProfileList from "../views/profileViews/ProfileList.vue";
import Profile from "../views/profileViews/Profile.vue";
import Pokedex from "../views/profileViews/Pokedex.vue";
import Favourites from "../views/profileViews/Favourites.vue";
// import PokemonDetail from "../views/profileViews/PokemonDetail.vue";

export default [
    { 
        path: '/profile', 
        name: 'Profile', 
        component: Profile,
        meta: { requiresAuth: true }
    },
    { 
        path: '/profile/list', 
        name: 'ProfileList', 
        component: ProfileList 
    },
    { 
        path: '/profile/pokedex', 
        name: 'Pokedex', 
        component: Pokedex,
        meta: { requiresAuth: true }
    },
    { 
        path: '/profile/favourites', 
        name: 'Favourites', 
        component: Favourites,
        meta: { requiresAuth: true }
    },
    // { 
    //     path: '/profile/pokedex/:id', 
    //     name: 'PokemonDetail', 
    //     component: PokemonDetail,
    //     meta: { requiresAuth: true }
    // }
];