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
        websocketUrl.set(localUrl); // saves to memory + localStorage
        toast.success('Settings saved successfully!');
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
