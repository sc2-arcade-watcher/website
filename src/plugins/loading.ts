import Vue from 'vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

declare class LoadingComponent extends Vue {
    hide(): void;
}

interface LoadingServiceOptions {
    container?: HTMLElement;
    canCancel?: boolean;
    onCancel?: () => any;
    color?: string;
    loader?: 'spinner' | 'dots' | 'bars';
    width?: number;
    height?: number;
    backgroundColor?: string;
    opacity?: number;
    zIndex?: number;
}

interface LoadingService {
    show(options?: LoadingServiceOptions): LoadingComponent
}

declare module 'vue/types/vue' {
    interface Vue {
        $loading: LoadingService;
    }
}

Vue.use(Loading, <LoadingServiceOptions>{
    opacity: 0.75,
    backgroundColor: '#000',
    color: '#2196f3',
});
