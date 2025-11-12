import Register from "../views/accountViews/Register.vue";
import Login from "../views/accountViews/Login.vue";

export default [
    { path: '/account/register', name: 'Register', component: Register },
    { path: '/account/login', name: 'Login', component: Login}
];