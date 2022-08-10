import Vue from 'vue';
import App from './App.vue';
import VueYoutube from 'vue-youtube';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faEye,
    faEyeSlash,
    faTrashCan,
    faFloppyDisk,
    faClock,
} from '@fortawesome/free-regular-svg-icons';
import {
    faBan,
    faPlus,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';

Vue.config.productionTip = false;

library.add(
    faEye,
    faEyeSlash,
    faTrashCan,
    faBan,
    faPlus,
    faXmark,
    faFloppyDisk,
    faClock,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueYoutube);

new Vue({
    render: h => h(App),
}).$mount('#app');
