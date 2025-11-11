import Register from "../views/accountViews/Register.vue";
import Home from "../views/Home.vue"

export default [
    { path: '/account/register', name: 'Register', component: Register },
    { path: '/account/login', name: 'Login', component: Home}
];