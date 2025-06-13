import React, { useState, useContext } from 'react';
import { Sidebar as Drawer } from 'primereact/sidebar';
import eventBus from '@/services/busService';
// import FxFeed from '@/components/FxFeed';
import AppSettings from '@/components/Settings';

export default function Sidebar() {
    const [showHistory, setShowHistory] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const newChat = () => {
        eventBus.emit('new/chat');
        console.log('New chat started');
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
                style={{ width: '400px' }}
            ></Drawer>

            <Drawer
                visible={showSettings}
                onHide={() => setShowSettings(false)}
                header='Settings'
                position='left'
                style={{ width: '400px' }}
            >
                <AppSettings />
            </Drawer>
        </section>
    );
}
