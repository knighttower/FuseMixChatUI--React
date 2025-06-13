// Chat.jsx
import React, { useEffect, useState, useRef } from 'react';
// Stores
import { useStore } from '@nanostores/react';
import { websocketUrl } from '@/stores/AppSettings';
import { useChatStore } from '@/stores/ChatStore';
// Services
import eventBus from '@/services/busService';
// Components
import Message from '@/components/Message';
import InputBar from '@/components/InputBar';
// Utils
import { uuid, typeOf, getDynamicId } from 'knighttower/utility';

export default function Chat() {
    const endpoint = useStore(websocketUrl);
    console.log('______ websocketUrl ______', endpoint);
    const { getLastMessage, updateMessageById, addMessage, connections, clearHistory } = useChatStore();
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);
    const socketIdRef = useRef(uuid()); // Setup websocket and event listeners

    useEffect(() => {
        if (!endpoint) return;

        const socket = new WebSocket(`//${endpoint}`);
        socketRef.current = socket;

        // socket.onmessage = (event) => {
        //     let data = event.data;
        //     if (data) {
        //         try {
        //             data = JSON.parse(data);
        //         } catch (e) {
        //             console.error('Failed to parse incoming data:', e);
        //         }
        //     }

        //     if (data?.response) {
        //         let response;
        //         const type = typeOf(data.response);
        //         switch (type) {
        //             case 'string':
        //             case 'null':
        //             case 'undefined':
        //             case 'number':
        //             case 'boolean':
        //             case 'integer':
        //                 response = data.response;
        //                 break;
        //             default:
        //                 let resp = data.response.text || data.response.response || data.response;
        //                 response = typeOf(resp, 'string') ? resp.trim('"') : JSON.stringify(resp);
        //                 break;
        //         }

        //         const socketId = socketIdRef.current;
        //         const last = getLastMessage(socketId);

        //         if (last?.user === 'assistant') {
        //             const combined = [last.message, response].join('');
        //             updateMessageById(socketId, last.id, combined);
        //         } else {
        //             addMessage(socketId, {
        //                 message: response,
        //                 user: 'assistant',
        //                 id: getDynamicId(),
        //             });
        //         }

        //         setMessages([...connections[socketId]]);
        //         eventBus.emit('resetEditor');
        //         eventBus.emit('agentHasCompleted');
        //     }
        // };

        // socket.onopen = () => {
        //     console.log('Chat Connected to server');
        //     eventBus.emit('prompt-websocket/ready');
        // };

        // socket.onclose = () => {
        //     console.log('Chat Disconnected from server');
        //     eventBus.emit('prompt-window/close');
        // };

        // socket.onerror = (err) => {
        //     console.error('Chat WebSocket error:', err);

        //     eventBus.emit('prompt-window/close');

        //     socket.close();
        // }; // Listen to message send and reset commands

        // eventBus.on('sendEditorMsg', (content) => {
        //     if (!content || !socketRef.current) return;

        //     const socketId = socketIdRef.current;
        //     const msg = {
        //         message: content,
        //         user: 'user',
        //         id: getDynamicId(),
        //     };

        //     addMessage(socketId, msg);
        //     setMessages([...connections[socketId]]);
        //     socketRef.current.send(content);
        // });

        // eventBus.on('resetBot', (command) => {
        //     const socketId = socketIdRef.current;
        //     if (command === 'all' || command === socketId) {
        //         clearHistory(socketId);
        //         setMessages([...connections[socketId]]);
        //     }
        // }); // Initial message sync

        // const socketId = socketIdRef.current;
        // if (connections[socketId]) {
        //     setMessages([...connections[socketId]]);
        // }

        // return () => {
        //     socketRef.current?.close();
        //     eventBus.off('sendEditorMsg');
        //     eventBus.emit('prompt-window/close');
        // };
    }, [endpoint]);

    if (!endpoint) {
        return <div className='chat-window'>Missing WebSocket URL in settings.</div>;
    }

    return (
        <div className='chat__window'>
            <div className='chat__messages max-h100 overscroll-x-auto pb-5'>
                {messages.map((msg, index) => (
                    <Message key={index} message={msg.message} isUser={msg.user === 'user'} />
                ))}
            </div>
            <div className='chat__inputs'>
                <InputBar />
            </div>
        </div>
    );
}
