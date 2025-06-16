const { contextBridge, ipcRenderer } = require('electron');

// Custom API exposed to the renderer
const api = {
    darkMode: {
        toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
        system: () => ipcRenderer.invoke('dark-mode:system'),
    },
};

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('api', api);
    } catch (error) {
        console.error('Preload contextBridge error:', error);
    }
}
