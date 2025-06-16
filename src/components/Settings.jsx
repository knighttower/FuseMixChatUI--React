// src/components/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { websocketUrl } from '@/stores/AppSettings';
import toast from 'knighttower/toast';

export default function Settings() {
    const storedUrl = useStore(websocketUrl);
    const [localUrl, setLocalUrl] = useState('');

    useEffect(() => {
        setLocalUrl(storedUrl);
    }, [storedUrl]);

    const save = () => {
        try {
            let input = localUrl.trim();

            // If protocol is missing, assume ws:// by default
            if (!/^wss?:\/\//i.test(input)) {
                input = 'ws://' + input;
            }

            // Extract the protocol and the rest
            const match = input.match(/^(wss?):\/\/(.+)$/i);
            if (!match || !match[1] || !match[2]) {
                toast.error('Invalid WebSocket URL format');
                return;
            }

            const protocol = match[1].toLowerCase();
            let hostAndPath = match[2]
                .replace(/\/+$/, '') // Remove trailing slashes
                .replace(/[^\w.-:/]/g, ''); // Sanitize

            const finalUrl = `${protocol}://${hostAndPath}`;

            // Validate final structure
            const isValid = /^wss?:\/\/[\w.-]+(:\d+)?(\/[\w./-]*)?$/i.test(finalUrl);
            if (!isValid) {
                toast.error('Invalid WebSocket URL');
                return;
            }

            setLocalUrl(finalUrl);
            websocketUrl.set(finalUrl);
            toast.success('Settings saved successfully!');
        } catch (e) {
            console.error(e);
            toast.error('Error processing URL');
        }
    };

    return (
        <section className='p-4'>
            <label htmlFor='websocketUrl' className='pb-2 block'>
                Enter WebSocket URL (<code>ws://</code> or <code>wss://</code>):
            </label>
            <input
                type='text'
                name='websocketUrl'
                value={localUrl}
                onChange={(e) => setLocalUrl(e.target.value)}
                placeholder='ws://example.com/socket'
                className='w-full p-2 border rounded mb-4'
                //prettier-ignore
                pattern="^(ws|wss):\\/\\/.+$"
                title='Enter a valid WebSocket URL (ws:// or wss://)'
                required
            />

            <button className='p-button p-component p-button-outlined w-150px text-align-center block' onClick={save}>
                Save Settings
            </button>
        </section>
    );
}
