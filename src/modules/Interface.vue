<template>
    <div>
        <aside>
            <fx-sidebar></fx-sidebar>
        </aside>

        <main class="main-content">
            <fx-feed></fx-feed>
        </main>
    </div>
</template>

<script>
    import { buildModel } from '@src/resources/js/buildModel.mjs';
    export default {
        name: 'Interface',
        setup() {
            const data = buildModel({
                data: {
                    isSidebarOpen: true,
                    showSettingsModal: false,
                },
            });

            console.log('______ data ______', data);
            // Define reactive state
        },
    };
</script>
