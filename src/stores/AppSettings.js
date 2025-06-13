// src/stores/settings.js
import { persistentAtom } from '@nanostores/persistent';

export const websocketUrl = persistentAtom(
    'websocketUrl', // localStorage key
    '', // default value
    {
        encode: JSON.stringify,
        decode: JSON.parse,
    },
);
