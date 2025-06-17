import React, { useState, useEffect } from 'react';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import { convertToMarkdown } from '@/plugins/HtmlToMarkdownPlugin';
import eventBus from '@/services/busService';

export default function InputArea() {
    const [text, setText] = useState('');
    const [agentIsWorking, setAgentIsWorking] = useState(false);
    const [size, setSize] = useState(80);
    const [isExpanded, setIsExpanded] = useState(false);

    const send = () => {
        setAgentIsWorking(true);
        const content = convertToMarkdown(text);
        editorSmall(); // Reset editor size after sending
        eventBus.emit('chat/send/userMsg', content);
    };

    const editorSmall = () => {
        setSize(80);
        setIsExpanded(false);
    };

    const editorBig = () => {
        // get the window height and set the size to 80% of it
        const windowHeight = window.innerHeight;
        const calculatedSize = Math.floor(windowHeight * 0.6);
        setSize(calculatedSize);
        setIsExpanded(true);
    };

    const handleExpand = () => {
        if (isExpanded) {
            editorSmall();
            return;
        }

        editorBig();
    };

    const expand = (e) => {
        e.preventDefault();
        handleExpand();
    };

    useEffect(() => {
        const resetEditor = () => setText('');
        const onAgentComplete = () => setAgentIsWorking(false);
        eventBus.on('chat/new', resetEditor);
        eventBus.on('chat/resetEditor', resetEditor);
        eventBus.on('chat/agentHasCompleted', onAgentComplete);
        editorSmall();

        return () => {
            eventBus.off('chat/resetEditor', resetEditor);
            eventBus.off('chat/agentHasCompleted', onAgentComplete);
            eventBus.off('chat/new', resetEditor);
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
            <div className='chat__input-area__expand'>
                <a href='#' onClick={expand}>
                    <svg className='x-icon' style={{ width: '30px', height: '20px' }}>
                        {isExpanded ? (
                            <use href='assets/images/fx-SVG-sprite.svg#go-down' />
                        ) : (
                            <use href='assets/images/fx-SVG-sprite.svg#go-up' />
                        )}
                    </svg>
                </a>
            </div>
            <Editor
                value={text}
                onTextChange={(e) => setText(e.htmlValue)}
                style={{ minHeight: size + 'px', maxHeight: '600px', overflowY: 'auto' }}
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
