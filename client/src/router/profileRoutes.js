import ProfileList from "../views/profileViews/ProfileList.vue";
import Profile from "../views/profileViews/Profile.vue";

export default [
    { 
        path: '/profile', 
        name: 'Profile', 
        component: Profile,
        meta: { requiresAuth: true }
    },
    { path: '/profile/list', name: 'List', component: ProfileList }
];