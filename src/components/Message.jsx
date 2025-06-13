// PromptMessage.jsx
import React, { useEffect, useMemo } from 'react';
import MarkdownIt from 'markdown-it';
import toast from 'knighttower/toast';

const PromptMessage = ({ message, isUser }) => {
    const md = useMemo(() => new MarkdownIt(), []);
    const renderedMessage = useMemo(() => md.render(message || ''), [md, message]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(
            () => {
                window.$toast?.push?.({
                    message: 'Copied!',
                    type: 'success',
                    closeButton: true,
                });
            },
            (err) => {
                alert('Could not copy text: ' + err);
            },
        );
    };

    const addCopyButtons = () => {
        const codeBlocks = document.querySelectorAll('.chat__message:not(.--user) .chat__message__content');
        codeBlocks.forEach((block) => {
            const parent = block.parentElement;
            if (!parent.querySelector('.copy-button')) {
                const button = document.createElement('button');
                button.innerHTML = 'Copy';
                button.setAttribute('class', 'chat__copy-button');
                button.addEventListener('click', () => {
                    toast.success('Copied!');
                    copyToClipboard(block.textContent);
                });
                parent.appendChild(button);
            }
        });
    };

    const removeCopyButtons = () => {
        const buttons = document.querySelectorAll('.copy-button');
        buttons.forEach((button) => button.remove());
    };

    useEffect(() => {
        removeCopyButtons();
        addCopyButtons();
        return () => {
            removeCopyButtons();
        };
    }, [renderedMessage]);

    return (
        <div className={`chat__message ${isUser ? '--user' : ''}`}>
            <div className='chat__message__tag'>
                <small>{isUser ? '-- user --' : '-- agent --'}</small>
            </div>

            <div className='chat__message__content' dangerouslySetInnerHTML={{ __html: renderedMessage }} />
        </div>
    );
};

export default PromptMessage;
