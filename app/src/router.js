import Vue from 'vue';
import VueRouter from 'vue-router';
import HomePage from './components/HomePage.vue';
import LoginHomePage from './components/LoginHomePage.vue';
import PhoneOverview from './components/PhoneOverview.vue';

Vue.use(VueRouter);

export default new VueRouter ({
    routes: [
        { path: '/', component: HomePage },
        { path: '/login-page', component: LoginHomePage },
        { path: '/phone-overview', component: PhoneOverview },
        { path: '*', redirect: '/' }
    ]
});