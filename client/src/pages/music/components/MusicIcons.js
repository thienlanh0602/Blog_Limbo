import React from 'react';

export const PlayIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff"><path d="M8 5v14l11-7z" /></svg>;
export const PauseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;
export const SkipPreviousIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>;
export const SkipNextIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6z" /></svg>;

export const VolumeUpIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 14V10C4 9.45 4.45 9 5 9H8L13.3 4.7c.4-.3.9 0 .9.5V18.8c0 .5-.5.8-.9.5L8 15H5c-.55 0-1-.45-1-1z" fill="#ffffff" />
        <path d="M17.5 9.5L19 8M17.5 14.5L19 16M17.5 12H19.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const VolumeOffIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 14V10C4 9.45 4.45 9 5 9H8L13.3 4.7c.4-.3.9 0 .9.5V18.8c0 .5-.5.8-.9.5L8 15H5c-.55 0-1-.45-1-1z" fill="#ffffff" />
        <path d="M17.5 10L21.5 14M21.5 10L17.5 14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const ShuffleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
    </svg>
);

export const RepeatIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
    </svg>
);

export const RepeatOneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
        <text x="12" y="14.2" fontSize="8" fontWeight="800" textAnchor="middle" fill="#ffffff" stroke="none">1</text>
    </svg>
);