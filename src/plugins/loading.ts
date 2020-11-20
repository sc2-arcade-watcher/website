import Vue from 'vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

Vue.use(Loading, {
    opacity: 0.75,
    backgroundColor: '#000',
    color: '#2196f3',
    lockScroll: false,
});
