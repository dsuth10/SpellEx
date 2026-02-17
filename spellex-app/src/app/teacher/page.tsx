import React from 'react';
import { getAllResults } from '@/lib/actions';
import { Trophy, Calendar, User, ChevronRight, BarChart3, LayoutDashboard, Bookmark } from 'lucide-react';
import Link from 'next/link';

export default async function TeacherDashboard() {
    const { results, success, error } = await getAllResults();

    if (!success) {
        return <div className="p-20 text-center text-red-500 font-bold">Error loading dashboard: {error}</div>;
    }

    const averageScore = results?.length
        ? (results.reduce((acc, curr) => acc + curr.totalScore, 0) / results.length).toFixed(1)
        : 0;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-xl">
                            <LayoutDashboard className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Teacher Console</h1>
                    </div>
                    <Link href="/" className="text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase text-xs tracking-widest">Sign Out</Link>
                </div>
            </header>

            <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100 flex items-center gap-6">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center">
                            <BarChart3 size={32} />
                        </div>
                        <div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Total Submissions</p>
                            <p className="text-4xl font-black text-slate-800">{results?.length || 0}</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100 flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center">
                            <Trophy size={32} />
                        </div>
                        <div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Average Score</p>
                            <p className="text-4xl font-black text-slate-800">{averageScore} <span className="text-slate-300 text-xl">/ 50</span></p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100 flex items-center gap-6">
                        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center">
                            <Calendar size={32} />
                        </div>
                        <div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Active Now</p>
                            <p className="text-4xl font-black text-slate-800">1</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
                    <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
                        <h2 className="text-xl font-black text-slate-900">Student Results</h2>
                        <span className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Live Updates</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Student</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Assessment</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Part 1</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Part 2</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Part 3</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Part 4</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Part 5</th>
                                    <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {results?.map((res) => (
                                    <tr key={res.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-500 transition-colors">
                                                    <User size={18} />
                                                </div>
                                                <span className="font-bold text-slate-700">{res.student.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 text-slate-500 font-medium">
                                                <Bookmark size={14} className="text-indigo-400" />
                                                <span>{res.assessmentName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center font-bold text-slate-600">{res.part1Score}</td>
                                        <td className="px-6 py-6 text-center font-bold text-slate-400 italic bg-slate-50/30">{res.part2Score}</td>
                                        <td className="px-6 py-6 text-center font-bold text-slate-600">{res.part3Score}</td>
                                        <td className="px-6 py-6 text-center font-bold text-slate-600">{res.part4Score}</td>
                                        <td className="px-6 py-6 text-center font-bold text-slate-600">{res.part5Score}</td>
                                        <td className="px-10 py-6 text-right">
                                            <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full font-black text-sm">
                                                {res.totalScore} / 50
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {results?.length === 0 && (
                        <div className="p-20 text-center text-slate-300 font-bold text-lg italic">
                            No student results found yet.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
