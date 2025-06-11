import { createApp, nextTick, defineAsyncComponent } from 'vue';
import { EventBus } from 'knighttower/utility/EventBus';
import { createPinia } from 'pinia';

// import router from './router';
// import './assets/main.css';

const App = createApp({
    setup() {
        nextTick(() => {
            // signal some libraries and helpers when this tobacco is ready
        });
    },
});
// -----------------------------------------
// --> PrimeVue
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
App.use(PrimeVue, {
    unstyled: false,
    theme: {
        preset: Aura,
    },
});

// -----------------------------------------
// --> Pinia
App.use(createPinia());
// -----------------------------------------

App.provide('eventBus', new EventBus());

import Sidebar from './components/Sidebar.vue';
import Settings from './components/Settings.vue';
const coreComponents = new Map([
    ['fx-sidebar', Sidebar],
    ['fx-settings', Settings],
    // ['fx-kraken-user-status', defineAsyncComponent(() => import('@js/app/kraken/user/status.vue'))],
]);
coreComponents.forEach((component, name) => {
    App.component(name, component);
});

// =========================================
// --> Build the App
// --------------------------
App.mount('#fx--app');
