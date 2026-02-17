"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LogIn, UserPlus, ShieldCheck, ArrowLeft, KeyRound, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/components/AssessmentItems';

export default function LoginPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const role = searchParams.get('role') || 'STUDENT';
    const isTeacher = role === 'TEACHER';

    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isTeacher) {
            setIsRegistering(false);
        }
    }, [isTeacher]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/custom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role, isRegistering }),
            });

            const data = await response.json();

            if (response.ok) {
                // Persist user for the session
                window.localStorage.setItem('spellex-user', JSON.stringify(data.user));

                if (isTeacher) {
                    router.push('/teacher');
                } else {
                    router.push('/assessment');
                }
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn(
            "min-h-screen flex items-center justify-center p-6 bg-slate-50 transition-colors duration-1000",
            isTeacher ? "bg-emerald-50/50" : "bg-indigo-50/50"
        )}>
            <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
                    <div className={cn(
                        "p-10 text-white flex flex-col items-center",
                        isTeacher ? "bg-emerald-600" : "bg-indigo-600"
                    )}>
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/30">
                            {isTeacher ? <ShieldCheck size={32} /> : <LogIn size={32} />}
                        </div>
                        <h1 className="text-3xl font-black tracking-tight mb-2">
                            {isTeacher ? "Teacher Portal" : "Student Login"}
                        </h1>
                        <p className="text-white/70 font-medium">
                            {isRegistering ? "Create your account" : "Sign in to your dashboard"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 animate-in shake duration-300">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                <input
                                    type="text"
                                    required
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold"
                                />
                            </div>

                            <div className="relative group">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    placeholder={isTeacher ? "PIN / Password" : "Password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                "w-full py-4 rounded-2xl text-white font-black text-lg transition-all active:scale-95 shadow-lg",
                                isTeacher
                                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
                                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100",
                                isLoading && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {isLoading ? "Authenticating..." : (isRegistering ? "Create Account" : "Sign In")}
                        </button>

                        {!isTeacher && (
                            <button
                                type="button"
                                onClick={() => setIsRegistering(!isRegistering)}
                                className="w-full text-slate-400 font-bold text-sm hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                            >
                                {isRegistering ? "Already have an account? Sign In" : "New student? Create an account"}
                            </button>
                        )}
                    </form>
                </div>

                <Link href="/" className="mt-8 flex items-center justify-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-colors group">
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-2" />
                    Back to Selection
                </Link>
            </div>
        </div>
    );
}
