import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import router from './router.js';
// import './tailwind.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


// REGULAR ICONS
import { faTrashCan, faPenToSquare, faFolderOpen, faFloppyDisk, faUser } from '@fortawesome/free-regular-svg-icons';

// SOLID ICONS
import { faAlignCenter, faAlignLeft, faAlignRight, faAngleDown, faArrowsDownToLine, faArrowsUpToLine, faGripLinesVertical, faPlus, faPrint, faRightFromBracket, } from '@fortawesome/free-solid-svg-icons';

library.add(faTrashCan, faPlus, faPenToSquare, faFolderOpen, faFloppyDisk, faPrint, faAngleDown, faAlignLeft, faAlignCenter, faAlignRight, faArrowsUpToLine, faArrowsDownToLine, faRightFromBracket, faUser, faGripLinesVertical)
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueRouter);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');