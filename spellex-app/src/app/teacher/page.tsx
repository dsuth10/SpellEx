import React from 'react';
import { getAllResults } from '@/lib/actions';
import { Trophy, Calendar, User, ChevronRight, BarChart3, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default async function TeacherDashboard() {
    const { results, success, error } = await getAllResults();

    if (!success) {
        return <div className="p-20 text-center text-red-500 font-bold">Error loading dashboard: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-600 text-white p-3 rounded-2xl">
                            <LayoutDashboard size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Teacher Console</h1>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Assessment Monitoring</p>
                        </div>
                    </div>

                    <Link href="/" className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition">
                        Sign Out
                    </Link>
                </div>
            </header>

            <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <BarChart3 size={24} />
                            </div>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Total Submissions</p>
                        </div>
                        <p className="text-4xl font-black text-slate-900">{results?.length || 0}</p>
                    </div>

                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                <Trophy size={24} />
                            </div>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Average Score</p>
                        </div>
                        <p className="text-4xl font-black text-slate-900">
                            {results?.length
                                ? Math.round(results.reduce((acc, curr) => acc + curr.totalScore, 0) / results.length)
                                : 0} <span className="text-slate-300 text-xl">/ 50</span>
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[32px] shadow-lg shadow-indigo-100 text-white">
                        <h3 className="text-lg font-bold mb-2">Class Performance</h3>
                        <p className="text-white/70 text-sm mb-6">Real-time overview of the current assessment period.</p>
                        <div className="flex justify-between items-end gap-2 h-20">
                            {[45, 60, 40, 80, 95, 70, 85].map((h, i) => (
                                <div key={i} className="flex-1 bg-white/20 rounded-t-lg transition-all hover:bg-white/40" style={{ height: `${h}%` }} />
                            ))}
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
                                <tr className="bg-slate-50/50 text-slate-400 text-xs font-black uppercase tracking-widest">
                                    <th className="px-10 py-6">Student Username</th>
                                    <th className="px-6 py-6">Date Submitted</th>
                                    <th className="px-6 py-6">P1 (Spelling)</th>
                                    <th className="px-6 py-6">P3 (Spelling)</th>
                                    <th className="px-6 py-6">P4 (MC)</th>
                                    <th className="px-6 py-6">P5 (Edit)</th>
                                    <th className="px-10 py-6 text-right">Overall Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {results?.map((res) => (
                                    <tr key={res.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center font-bold uppercase">
                                                    {res.student.username[0]}
                                                </div>
                                                <span className="font-black text-slate-800">{res.student.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-slate-500 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-300" />
                                                {new Date(res.submittedAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-sm">
                                                {res.part1Score} / 12
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-sm">
                                                {res.part3Score} / 5
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-sm">
                                                {res.part4Score} / 4
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-sm">
                                                {res.part5Score} / 9
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <span className="text-2xl font-black text-slate-900">{res.totalScore}</span>
                                            <span className="text-slate-300 text-sm font-bold ml-1">/ 50</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {(!results || results.length === 0) && (
                        <div className="p-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                <User size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-400">No results found yet.</h3>
                            <p className="text-slate-300 mt-2">Results will appear here as students complete their assessments.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
