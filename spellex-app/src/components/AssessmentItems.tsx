"use client";

import React, { useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Common Components ---

interface AudioPlayerProps {
    src: string;
    label?: string;
    className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, label, className }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    React.useEffect(() => {
        if (typeof Audio !== 'undefined') {
            setAudio(new Audio(src));
        }
    }, [src]);

    const toggle = () => {
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    if (audio) {
        audio.onended = () => setIsPlaying(false);
    }

    return (
        <button
            onClick={toggle}
            className={cn(
                "flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors",
                className
            )}
        >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {label && <span>{label}</span>}
        </button>
    );
};

// --- Part 1 & 3 Components ---

interface SpellingInputProps {
    id: number;
    value: string;
    audio: string;
    onChange: (val: string) => void;
}

export const SpellingInput: React.FC<SpellingInputProps> = ({ id, value, audio, onChange }) => {
    return (
        <div className="flex items-center gap-4 mb-4">
            <span className="font-bold w-6">{id}.</span>
            <AudioPlayer src={audio} />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 p-2 border-b-2 border-gray-300 focus:border-indigo-500 outline-none uppercase"
            />
        </div>
    );
};

// --- Part 2 Component ---

export interface DictationProps {
    value: string;
    audio: string;
    onChange: (val: string) => void;
}

export const Dictation: React.FC<DictationProps> = ({ value, audio, onChange }) => {
    return (
        <div className="space-y-4">
            <AudioPlayer src={audio} label="Play Dictation Passage" />
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none resize-none leading-relaxed"
                placeholder="Type the dictation passage here..."
            />
        </div>
    );
};

// --- Part 4 Component ---

export interface Part4ChoiceProps {
    sentence: string;
    blanks: { options: string[] }[];
    values: string[];
    onChange: (index: number, val: string) => void;
}

export const Part4Choice: React.FC<Part4ChoiceProps> = ({ sentence, blanks, values, onChange }) => {
    const parts = sentence.split(/\[blank\d+\]/);

    return (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-4 text-lg leading-loose text-slate-700">
            {parts.map((part, idx) => (
                <React.Fragment key={idx}>
                    <span>{part}</span>
                    {idx < blanks.length && (
                        <select
                            value={values[idx] || ''}
                            onChange={(e) => onChange(idx, e.target.value)}
                            className="px-3 py-1 border-b-2 border-indigo-200 bg-indigo-50 text-indigo-900 rounded-lg focus:border-indigo-500 outline-none font-semibold cursor-pointer appearance-none min-w-[120px] text-center"
                        >
                            <option value="">Select...</option>
                            {blanks[idx].options.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

// --- Part 5 Component ---

export interface Part5EditingProps {
    paragraph: string;
    targetsLength: number;
    values: string[];
    onChange: (index: number, val: string) => void;
}

export const Part5Editing: React.FC<Part5EditingProps> = ({ paragraph, targetsLength, values, onChange }) => {
    return (
        <div className="space-y-12">
            <div className="p-8 bg-amber-50 rounded-2xl border-2 border-amber-100 italic leading-relaxed text-lg text-slate-800 shadow-inner">
                {paragraph}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: targetsLength }).map((_, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Correction {idx + 1}</label>
                        <input
                            type="text"
                            value={values[idx] || ''}
                            onChange={(e) => onChange(idx, e.target.value)}
                            className="p-3 bg-white border-b-2 border-slate-200 focus:border-indigo-500 outline-none uppercase font-semibold text-indigo-700"
                            placeholder={`Word ${idx + 1}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
