import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';

// =========================================
// --> Components
// --------------------------
import Sidebar from '@/components/Sidebar';
import Chat from '@/modules/chat';

const componentMap = {
    'x-chat': Chat,
    'x-sidebar': Sidebar,
};
Object.entries(componentMap).forEach(([tag, Component]) => {
    const nodes = document.querySelectorAll(tag);
    nodes.forEach((el) => {
        ReactDOM.createRoot(el).render(
            <PrimeReactProvider>
                <Component />
            </PrimeReactProvider>,
        );
    });
});
