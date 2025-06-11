<template>
    <section>
        <input
            type="text"
            v-model="websockeUrl"
            placeholder="Websocket URL..."
            class="w-full p-2 border rounded mb-4"
        />
        <button class="p-button p-component p-button-outlined w-full" @click="save()">Save Settings</button>
    </section>
</template>
<script>
    import { useSettingsStore } from '@src/stores/settings';
    import { ref } from 'vue';

    export default {
        setup() {
            const settingsStore = useSettingsStore();

            // Reactive local copy to bind in v-model
            const websockeUrl = ref(settingsStore.websocketUrl);

            // Save button handler
            const save = () => {
                settingsStore.setWebsocketUrl(websockeUrl.value);
            };

            return {
                websockeUrl,
                save,
            };
        },
    };
</script>
