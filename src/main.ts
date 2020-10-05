import Vue from 'vue';
import * as dfns from 'date-fns';

// import 'font-awesome/css/font-awesome.css';
// @ts-ignore

// import '@mdi/font/css/materialdesignicons.css';

import * as starc from './starc-api/starc';
import * as helpers from './helpers';

import './plugins/highcharts';
import './plugins/loading';
import './plugins/toasts';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './plugins/appStore';

import App from './App.vue'
import './custom.scss';

Vue.config.productionTip = false;

Vue.use({
    install: (Vue) => {
        const sAPI = new starc.StarcAPI();

        Object.defineProperty(Vue.prototype, '$starc', {
            // api.interceptors.request.use();
            get() {
                return sAPI;
            }
        });

        Object.defineProperty(Vue.prototype, '$sTypes', {
            get() {
                return starc;
            }
        });

        Object.defineProperty(Vue.prototype, '$helpers', {
            get() {
                return helpers;
            }
        });

        Object.defineProperty(Vue.prototype, '$dfns', {
            get() {
                return dfns;
            }
        });

        Object.defineProperty(Vue.prototype, '$store', {
            get() {
                return store;
            }
        });
    },
});

declare module 'vue/types/vue' {
    interface Vue {
        $starc: starc.StarcAPI;
        $sTypes: typeof starc;
        $helpers: typeof helpers;
        $dfns: typeof dfns;
        $store: typeof store;
    }
}

const app = new Vue({
    router,
    vuetify,
    render: h => h(App),
}).$mount('#app');
