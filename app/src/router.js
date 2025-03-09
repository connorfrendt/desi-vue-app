import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginComp from './components/LoginPage.vue';
import PhoneOverview from './components/PhoneOverview.vue';

Vue.use(VueRouter);

export default new VueRouter ({
    routes: [
        { path: '/login-page', component: LoginComp },
        { path: '/phone-overview', component: PhoneOverview }
    ]
})