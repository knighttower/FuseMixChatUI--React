// src/components/Chat.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@nanostores/react';
// Stores
import { websocketUrl } from '@/stores/AppSettings';
import { connections, chatStore } from '@/stores/ChatStore';
// Services
import eventBus from '@/services/busService';
// Components
import Message from '@/components/Message';
import InputBar from '@/components/InputBar';
// Utils
import { uuid, typeOf, getDynamicId } from 'knighttower/utility';

export default function Chat() {
    const endpoint = useStore(websocketUrl);
    const allConnections = useStore(connections);
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);
    const socketIdRef = useRef(uuid());

    const initSocket = () => {
        if (!endpoint) return;

        const socket = new WebSocket(`//${endpoint}`);

        socket.onopen = () => {
            socketRef.current = socket;
            console.log('Chat Connected to server');
            eventBus.emit('websocket/ready');
        };

        socket.onclose = () => {
            console.log('Chat Disconnected from server');
            eventBus.emit('websocket/closed');
        };

        socket.onerror = (err) => {
            console.error('Chat WebSocket error:', err);
            eventBus.emit('websocket/error', err);
            socket.close();
            socketIdRef.current = null;
        };

        socket.onmessage = (event) => {
            let raw = event.data;
            let data = raw;

            if (typeof raw === 'string') {
                try {
                    data = JSON.parse(raw);
                } catch (e) {
                    console.warn('Raw data is plain string, not JSON:', raw);
                }
            }

            let response;
            if (typeof data === 'object' && data !== null) {
                let possible = data.response ?? data;
                if (typeof possible === 'object' && possible !== null) {
                    response = possible.text || possible.response || possible;
                } else {
                    response = possible;
                }
            } else {
                response = data;
            }

            const type = typeOf(response);
            let finalResponse;
            switch (type) {
                case 'string':
                    finalResponse = response.trim('"');
                    break;
                case 'number':
                case 'boolean':
                case 'null':
                case 'undefined':
                case 'integer':
                    finalResponse = String(response);
                    break;
                default:
                    try {
                        finalResponse = JSON.stringify(response);
                    } catch {
                        finalResponse = '[Unserializable response]';
                    }
            }

            const socketId = socketIdRef.current;
            const last = chatStore.getLastMessage(socketId);

            if (last?.user === 'assistant') {
                const combined = [last.message, finalResponse].join('');
                chatStore.updateMessageById(socketId, last.id, combined);
            } else {
                chatStore.addMessage(socketId, {
                    message: finalResponse,
                    user: 'assistant',
                    id: getDynamicId(),
                });
            }

            setMessages(chatStore.getHistory(socketId));
            eventBus.emit('chat/resetEditor');
            eventBus.emit('chat/agentHasCompleted');
        };

        socketRef.current = socket;
    };

    useEffect(() => {
        if (!endpoint) return;
        initSocket();

        // Event listeners
        eventBus.on('chat/send/userMsg', (content) => {
            if (!content || !socketRef.current) return;

            const socketId = socketIdRef.current;
            const msg = {
                message: content,
                user: 'user',
                id: getDynamicId(),
            };

            chatStore.addMessage(socketId, msg);
            setMessages(chatStore.getHistory(socketId));
            socketRef.current.send(content);
        });

        eventBus.on('chat/history/clear', (command) => {
            const socketId = socketIdRef.current;
            console.log('______ command ______', command);
            if (command === 'all') {
                chatStore.clearHistoryAll();
                setMessages([]);
                eventBus.emit('chat/resetEditor');
                eventBus.emit('chat/agentHasCompleted');
                eventBus.emit('chat/new');
            }
            if (command === socketId) {
                chatStore.clearHistory(socketId);
                setMessages(chatStore.getHistory(socketId));
            }
        });

        eventBus.on('chat/new', () => {
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }

            const newSocketId = uuid();
            socketIdRef.current = newSocketId;

            chatStore.clearHistory(newSocketId);
            setMessages([]);

            console.log('New chat session started with ID:', newSocketId);

            initSocket();
        });

        const socketId = socketIdRef.current;
        if (allConnections[socketId]) {
            setMessages([...allConnections[socketId]]);
        }

        return () => {
            socketRef.current?.close();
            eventBus.off('chat/send/userMsg');
            eventBus.emit('websocket/closed');
        };
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
            {socketRef.current ? (
                <div className='chat__inputs'>
                    <InputBar />
                </div>
            ) : (
                <h3 className='chat__disconnected'>Waiting for server connection...</h3>
            )}
        </div>
    );
}
