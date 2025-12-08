import RegisterSelect from "../views/accountViews/RegisterSelect.vue";
import RegisterEmail from "../views/accountViews/RegisterEmail.vue";
import RegisterPassword from "../views/accountViews/RegisterPassword.vue";
import RegisterUsername from "../views/accountViews/RegisterUsername.vue";
import RegisterOK from "../views/accountViews/RegisterOK.vue";
import Login from "../views/accountViews/Login.vue";

export default [
    { path: '/account/register', name: 'RegisterSelect', component: RegisterSelect },
    { path: '/account/register/email', name: 'RegisterEmail', component: RegisterEmail },
    { path: '/account/register/password', name: 'RegisterPassword', component: RegisterPassword },
    { path: '/account/register/username', name: 'RegisterUsername', component: RegisterUsername },
    { path: '/account/register/success', name: 'RegisterOK', component: RegisterOK },
    { path: '/account/login', name: 'Login', component: Login }
];