// https://zustand.docs.pmnd.rs/getting-started/introduction
import { create } from 'zustand';
// https://valtio.dev/docs/introduction/getting-started
import { proxy, snapshot } from 'valtio';

const state = proxy({
    connections: {},
    usage: {},
});

export const useChatStore = create(() => ({
    state,

    // Actions
    addMessage: (socketId, message) => {
        if (!state.connections[socketId]) {
            state.connections[socketId] = [];
        }
        state.connections[socketId].push(message);
    },

    addUsage: (socketId, usageEntry) => {
        if (!state.usage[socketId]) {
            state.usage[socketId] = [];
        }
        state.usage[socketId].push(usageEntry);
    },

    updateMessageById: (socketId, messageId, newMessage) => {
        const connection = state.connections[socketId];
        if (!connection) return false;

        const index = connection.findIndex((item) => item.id === messageId);
        if (index === -1) return false;

        connection[index].message = newMessage;
        return true;
    },

    clearHistory: (socketId) => {
        state.connections[socketId] = [];
    },

    // Getters (non-reactive, use snapshot for pure values)
    getHistory: (socketId) => {
        const snap = snapshot(state);
        return snap.connections[socketId] || [];
    },

    getReadHistory: (socketId) => {
        const history = useChatStore.getState().getHistory(socketId);
        return history.map((item) => `${item.user}: ${item.message}`).join('\n');
    },

    getLastMessage: (socketId) => {
        const history = useChatStore.getState().getHistory(socketId);
        return history.length ? history[history.length - 1] : null;
    },

    getMessageById: (socketId, messageId) => {
        const history = useChatStore.getState().getHistory(socketId);
        return history.find((item) => item.id === messageId) || null;
    },
}));
