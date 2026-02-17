"use client";

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Users, ArrowRight } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-emerald-50">
            <div className="max-w-4xl w-full text-center mb-16 animate-in fade-in slide-in-from-top-8 duration-1000">
                <h1 className="text-6xl font-black text-indigo-950 tracking-tighter mb-4">
                    SpellEx <span className="text-indigo-600">Pro</span>
                </h1>
                <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                    The ultimate platform for automated spelling assessments and classroom progress tracking.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Student Portal */}
                <Link href="/login?role=STUDENT" className="group">
                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 h-full flex flex-col items-center text-center transition-all hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 active:translate-y-0 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />

                        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mb-8 relative z-10 transition-transform group-hover:rotate-12">
                            <GraduationCap size={40} />
                        </div>

                        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight relative z-10">Student Assessment</h2>
                        <p className="text-slate-500 font-medium mb-8 leading-relaxed relative z-10">
                            Start your spelling test, complete all 5 parts, and see your results immediately.
                        </p>

                        <div className="mt-auto flex items-center gap-2 text-indigo-600 font-black uppercase text-sm tracking-widest relative z-10">
                            Enter Student Portal <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                        </div>
                    </div>
                </Link>

                {/* Teacher Portal */}
                <Link href="/login?role=TEACHER" className="group">
                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 h-full flex flex-col items-center text-center transition-all hover:shadow-2xl hover:shadow-emerald-100 hover:-translate-y-2 active:translate-y-0 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />

                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-8 relative z-10 transition-transform group-hover:-rotate-12">
                            <Users size={40} />
                        </div>

                        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight relative z-10">Teacher Dashboard</h2>
                        <p className="text-slate-500 font-medium mb-8 leading-relaxed relative z-10">
                            Manage student accounts, view scores for all assessments, and track progress.
                        </p>

                        <div className="mt-auto flex items-center gap-2 text-emerald-600 font-black uppercase text-sm tracking-widest relative z-10">
                            Enter Teacher Portal <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                        </div>
                    </div>
                </Link>
            </div>

            <footer className="mt-20 text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
                Powered by Antigravity Digital Engine
            </footer>
        </div>
    );
}
