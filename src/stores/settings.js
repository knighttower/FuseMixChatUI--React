import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        websocketUrl: '',
    }),

    actions: {
        setWebsocketUrl(url) {
            this.websocketUrl = url;
            this.persistSettings();
        },

        loadSettings() {
            const stored = localStorage.getItem('app-settings');
            if (stored) {
                const parsed = JSON.parse(stored);
                this.websocketUrl = parsed.websocketUrl || '';
            }
        },

        persistSettings() {
            localStorage.setItem(
                'app-settings',
                JSON.stringify({
                    websocketUrl: this.websocketUrl,
                }),
            );
        },
    },
});
