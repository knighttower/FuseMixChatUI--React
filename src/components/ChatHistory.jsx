import React from 'react';
import { useStore } from '@nanostores/react';
import { connections } from '@/stores/ChatStore';
import eventBus from '@/services/busService';
import toast from 'knighttower/toast';

export default function ChatHistory() {
    const allConnections = useStore(connections);
    const clear = () => {
        eventBus.emit('chat/history/clear', 'all');
        toast.success('Chat history cleared successfully!');
    };
    return (
        <>
            <div className='reset'>
                <button className='chat-reset' onClick={clear}>
                    Clear History
                </button>
            </div>
            <div className='chat-history space-y-4'>
                {Object.entries(allConnections).map(([socketId, thread]) => (
                    <div key={socketId} className='chat-thread p-4 border rounded-lg'>
                        <h3 className='font-bold mb-2 color-purple'>Chat ID: {socketId}</h3>
                        {thread.length === 0 ? (
                            <p className='text-gray-500'>No messages</p>
                        ) : (
                            <ul className='space-y-1'>
                                {thread.map((msg) => (
                                    <li key={msg.id} className='text-sm'>
                                        <span className='font-semibold'>{msg.user}:</span> {msg.message}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
