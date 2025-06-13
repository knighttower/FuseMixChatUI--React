import React, { useState, useContext } from 'react';
import { Sidebar as Drawer } from 'primereact/sidebar';
import eventBus from '@/services/busService';
import ChatHistory from '@/components/ChatHistory';
import AppSettings from '@/components/Settings';
import toast from 'knighttower/toast';

export default function Sidebar() {
    const [showHistory, setShowHistory] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const newChat = () => {
        eventBus.emit('chat/new');
        console.log('New chat started');
        toast.success('New chat started successfully!');
    };

    return (
        <section className='sidebar w-100'>
            <menu className='sidebar__menu list-none'>
                <li>
                    <a href='#' className='logo' onClick={(e) => e.preventDefault()}>
                        <svg className='x-icon' style={{ width: '100px', height: '25px' }}>
                            <use href='assets/images/fx-SVG-sprite.svg#fx-logo' />
                        </svg>
                    </a>
                </li>
                <li>
                    <a
                        href='#'
                        className='sidebar__action'
                        onClick={(e) => {
                            e.preventDefault();
                            newChat();
                        }}
                    >
                        New Chat ++
                    </a>
                </li>
                <li>
                    <a
                        href='#'
                        className='sidebar__action'
                        onClick={(e) => {
                            e.preventDefault();
                            setShowHistory(true);
                        }}
                    >
                        History
                    </a>
                </li>
                <li>
                    <a
                        href='#'
                        className='sidebar__action'
                        onClick={(e) => {
                            e.preventDefault();
                            setShowSettings(true);
                        }}
                    >
                        Settings
                    </a>
                </li>
            </menu>

            <Drawer
                visible={showHistory}
                onHide={() => setShowHistory(false)}
                header='Chat History'
                position='left'
                className='chat__history'
                style={{ width: '70%', minWidth: '300px' }}
            >
                <ChatHistory />
            </Drawer>

            <Drawer
                visible={showSettings}
                onHide={() => setShowSettings(false)}
                header='Settings'
                position='left'
                className='chat__settings'
                style={{ width: '400px' }}
            >
                <AppSettings />
            </Drawer>
        </section>
    );
}
