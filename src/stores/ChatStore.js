import { persistentMap } from '@nanostores/persistent';

export const connections = persistentMap(
    'chat-connections',
    {},
    {
        encode: JSON.stringify,
        decode: JSON.parse,
    },
);

export const usage = persistentMap(
    'chat-usage',
    {},
    {
        encode: JSON.stringify,
        decode: JSON.parse,
    },
);

export const chatStore = {
    addMessage(socketId, message) {
        const all = connections.get();
        const thread = all[socketId] || [];
        connections.set({
            ...all,
            [socketId]: [...thread, message],
        });
    },

    addUsage(socketId, usageData) {
        const all = usage.get();
        const record = all[socketId] || [];
        usage.set({
            ...all,
            [socketId]: [...record, usageData],
        });
    },

    updateMessageById(socketId, messageId, newMessage) {
        const all = connections.get();
        const thread = all[socketId];
        if (!thread) return false;

        const index = thread.findIndex((msg) => msg.id === messageId);
        if (index === -1) return false;

        const updated = [...thread];
        updated[index] = { ...updated[index], message: newMessage };

        connections.set({
            ...all,
            [socketId]: updated,
        });

        return true;
    },

    clearHistory(socketId) {
        const all = connections.get();
        connections.set({
            ...all,
            [socketId]: [],
        });
    },
    clearHistoryAll() {
        connections.set({});
        usage.set({});
        localStorage.removeItem('chat-connections');
        localStorage.removeItem('chat-usage');
    },

    getHistory(socketId) {
        const all = connections.get();
        return all[socketId] ? [...all[socketId]] : [];
    },

    getReadHistory(socketId) {
        return chatStore
            .getHistory(socketId)
            .map((item) => `${item.user}: ${item.message}`)
            .join('\n');
    },

    getLastMessage(socketId) {
        const thread = chatStore.getHistory(socketId);
        return thread.length === 0 ? null : thread[thread.length - 1];
    },

    getMessageById(socketId, messageId) {
        const thread = chatStore.getHistory(socketId);
        return thread.find((item) => item.id === messageId) || null;
    },
};
