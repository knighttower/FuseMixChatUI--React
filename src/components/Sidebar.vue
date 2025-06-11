<template>
    <section class="sidebar w-100">
        <menu class="sidebar__menu list-none">
            <li>
                <a href="#" class="logo">
                    <svg class="x-icon" style="width: 100px; height: 25px">
                        <use href="assets/images/fx-SVG-sprite.svg#fx-logo"></use>
                    </svg>
                </a>
            </li>
            <li>
                <a href="#" class="sidebar__action" @click="newChat">New Chat ++</a>
            </li>
            <li>
                <a href="#" class="sidebar__action" @click="showHistory = true">History</a>
            </li>

            <li>
                <a href="#" class="sidebar__action" @click="showSettings = true">Settings</a>
            </li>
        </menu>

        <Drawer v-model:visible="showHistory" header="Chat History" :style="{ width: '400px' }">
            <fx-feed></fx-feed>
        </Drawer>
        <Drawer v-model:visible="showSettings" header="Settings" :style="{ width: '400px' }">
            <fx-settings></fx-settings>
        </Drawer>
    </section>
</template>
<script>
    import { ref, inject } from 'vue';
    import Drawer from 'primevue/drawer';
    export default {
        components: {
            Drawer,
        },
        setup() {
            const bus = inject('eventBus');
            const showHistory = ref(false);
            const showSettings = ref(false);

            const newChat = () => {
                // Logic to start a new chat
                bus.emit('new/chat');
                console.log('New chat started');
            };

            return {
                showHistory,
                showSettings,
                newChat,
            };
        },
    };
</script>
