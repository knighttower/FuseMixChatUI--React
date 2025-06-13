import React, { useState, useEffect } from 'react';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import { convertToMarkdown } from '@/plugins/HtmlToMarkdownPlugin';
import eventBus from '@/services/busService';

export default function InputArea() {
    const [text, setText] = useState('');
    const [agentIsWorking, setAgentIsWorking] = useState(false);

    const send = () => {
        setAgentIsWorking(true);
        const content = convertToMarkdown(text);
        eventBus.emit('sendUserMsg', content);
    };

    useEffect(() => {
        const resetEditor = () => setText('');
        const onAgentComplete = () => setAgentIsWorking(false);

        eventBus.on('resetEditor', resetEditor);
        eventBus.on('agentHasCompleted', onAgentComplete);

        return () => {
            eventBus.off('resetEditor', resetEditor);
            eventBus.off('agentHasCompleted', onAgentComplete);
        };
    }, []);

    const modulesOptions = {
        toolbar: [
            ['code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['clean'],
        ],
    };

    return (
        <section className='chat__input-area w-100% pt-1'>
            <Editor
                value={text}
                onTextChange={(e) => setText(e.htmlValue)}
                style={{ minHeight: '80px', maxHeight: '150px', overflowY: 'auto' }}
                placeholder='Type your message here...'
                modules={modulesOptions}
                headerTemplate={<></>} // Hides the toolbar
            />
            <div className='chat__input-area__trigger'>
                <Button
                    onClick={send}
                    disabled={agentIsWorking}
                    className={`input-area__button btn--small ${agentIsWorking ? 'btn--disabled' : ''}`}
                    label={agentIsWorking ? 'Processing...' : 'Send'}
                />
            </div>
        </section>
    );
}
