import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import router from './router.js';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrashCan, faPenToSquare, faFolderOpen, faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import { faAngleDown, faPlus, faPrint } from '@fortawesome/free-solid-svg-icons';

library.add(faTrashCan, faPlus, faPenToSquare, faFolderOpen, faFloppyDisk, faPrint, faAngleDown)
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueRouter);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');