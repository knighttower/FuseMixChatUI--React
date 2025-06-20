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

function createId() {
    const now = new Date();
    return `${uuid(4)}--${now.getTime()}`;
}

export default function Chat() {
    const endpoint = useStore(websocketUrl);
    const allConnections = useStore(connections);
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketIdRef = useRef(createId());
    const messagesEndRef = useRef(null);

    const handleUserMsg = (content) => {
        if (!content || !socketRef.current) return;
        const socketId = socketIdRef.current;
        const msg = { message: content, user: 'user', id: getDynamicId() };
        chatStore.addMessage(socketId, msg);
        setMessages(chatStore.getHistory(socketId));

        try {
            socketRef.current.send(content);
        } catch (err) {
            console.error('Failed to send message:', err);
            toast.error('Failed to send message. Please try again.');
        }
    };

    const handleHistoryClear = (command) => {
        const socketId = socketIdRef.current;

        if (command === 'all') {
            chatStore.clearHistoryAll();
            setMessages([]);
            eventBus.emit('chat/new');
        }
        if (command === socketId) {
            chatStore.clearHistory(socketId);
            setMessages([]);
        }

        eventBus.emit('chat/resetEditor');
        eventBus.emit('chat/agentHasCompleted');
    };

    const handleNewChat = () => {
        const sock = socketRef.current;
        if (sock) {
            sock.onopen = sock.onmessage = sock.onclose = sock.onerror = null;
            sock.close(1000, 'New session');
        }
        socketRef.current = null;

        const newId = createId();
        socketIdRef.current = newId;
        chatStore.clearHistory(newId);
        setMessages([]);
        console.log('New chat session started with ID:', newId);

        initSocket();
    };

    const initSocket = () => {
        if (!endpoint) return;

        const socket = new WebSocket(endpoint);

        socket.onopen = () => {
            setIsConnected(true);
            socketRef.current = socket;
            console.log('Chat Connected to server');
            eventBus.emit('websocket/ready');
        };

        socket.onmessage = (event) => {
            let raw = event.data;
            let data = raw;
            if (typeof raw === 'string') {
                try {
                    data = JSON.parse(raw);
                } catch {
                    console.warn('Raw data is plain string, not JSON:', raw);
                }
            }

            let response;
            if (typeof data === 'object' && data !== null) {
                const possible = data.response ?? data;
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

        socket.onerror = (err) => {
            setIsConnected(false);
            console.error('Chat WebSocket error:', err);
            eventBus.emit('websocket/error', err);
            socket.close();
        };

        socket.onclose = () => {
            setIsConnected(false);
            console.log('Chat Disconnected from server');
            eventBus.emit('websocket/closed');
        };
    };

    useEffect(() => {
        if (!endpoint) return;

        initSocket();

        eventBus.on('chat/send/userMsg', handleUserMsg);
        eventBus.on('chat/history/clear', handleHistoryClear);
        eventBus.on('chat/new', handleNewChat);

        const socketId = socketIdRef.current;
        if (allConnections[socketId]) {
            setMessages([...allConnections[socketId]]);
        }

        return () => {
            const sock = socketRef.current;
            if (sock) {
                sock.onopen = sock.onmessage = sock.onclose = sock.onerror = null;
                sock.close(1000, 'Component unmount');
            }
            socketRef.current = null;

            eventBus.off('chat/send/userMsg', handleUserMsg);
            eventBus.off('chat/history/clear', handleHistoryClear);
            eventBus.off('chat/new', handleNewChat);

            eventBus.emit('websocket/closed');
        };
    }, [endpoint]); // Scroll to bottom on message update

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (!endpoint) {
        return <div className='chat-window'>Missing WebSocket URL in settings.</div>;
    }

    return (
        <div className='chat__window'>
            <div className='chat__messages max-h100 pb-5'>
                {messages.map((msg, i) => (
                    <Message key={i} message={msg.message} isUser={msg.user === 'user'} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {isConnected ? (
                <div className='chat__inputs'>
                    <InputBar />
                </div>
            ) : (
                <h3 className='chat__disconnected'>Waiting for server connection...</h3>
            )}
        </div>
    );
}
