import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginComp from './components/LoginComp.vue';

Vue.use(VueRouter);

export default new VueRouter ({
    routes: [
        { path: '/login-page', component: LoginComp }
    ]
})