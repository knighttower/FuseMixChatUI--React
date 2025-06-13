// src/components/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { websocketUrl } from '@/stores/AppSettings';
import toast from 'knighttower/toast';

export default function Settings() {
    const storedUrl = useStore(websocketUrl); // reactive store value
    const [localUrl, setLocalUrl] = useState(''); // input field buffer

    // Sync from store into local state on mount or update
    useEffect(() => {
        setLocalUrl(storedUrl);
    }, [storedUrl]);

    const save = () => {
        try {
            let cleanedUrl = localUrl.trim();

            // Remove ws, wss, ws://, wss://, or // from the beginning
            cleanedUrl = cleanedUrl.replace(/^(wss?:)?\/\//i, '').replace(/^wss?/i, '');

            // Remove trailing slashes
            cleanedUrl = cleanedUrl.replace(/\/+$/, '');

            // Optional: remove unsafe characters
            cleanedUrl = cleanedUrl.replace(/[^\w.-:/]/g, '');

            // Basic validation (host[:port][/path])
            const isValid = /^[\w.-]+(:\d+)?(\/[\w./-]*)?$/.test(cleanedUrl);
            if (!isValid) {
                toast.error('Invalid WebSocket URL');
                return;
            }

            setLocalUrl(cleanedUrl);
            websocketUrl.set(cleanedUrl);
            toast.success('Settings saved successfully!');
        } catch (e) {
            toast.error('Error sanitizing URL');
        }
    };

    return (
        <section>
            <input
                type='text'
                value={localUrl}
                onChange={(e) => setLocalUrl(e.target.value)}
                placeholder='Websocket URL...'
                className='w-full p-2 border rounded mb-4'
            />

            <button className='p-button p-component p-button-outlined w-full' onClick={save}>
                Save Settings
            </button>
        </section>
    );
}
