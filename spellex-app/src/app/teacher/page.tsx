"use client";

import React, { useEffect, useState } from 'react';
import { getAllResults, getStudentsByClass, createStudent, bulkCreateStudents } from '@/lib/actions';
import {
    Trophy, Calendar, User, ChevronRight, BarChart3,
    LayoutDashboard, Bookmark, Filter, Users, UserPlus,
    Upload, Download, Search, AlertCircle, CheckCircle2,
    Trash2, X, Plus
} from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboard() {
    const [view, setView] = useState<'results' | 'students'>('results');
    const [results, setResults] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [teacherClass, setTeacherClass] = useState('');

    // Manual form state
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Bulk upload state
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const userStr = window.localStorage.getItem('spellex-user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setTeacherClass(user.className || 'Default');
            loadData(user.className);
        } else {
            setError('Not authenticated');
            setIsLoading(false);
        }
    }, [view]);

    const loadData = async (className: string) => {
        setIsLoading(true);
        try {
            if (view === 'results') {
                const { results: data, success, error: fetchError } = await getAllResults(className);
                if (success) setResults(data || []);
                else setError(fetchError || 'Failed to fetch results');
            } else {
                const { students: data, success, error: fetchError } = await getStudentsByClass(className);
                if (success) setStudents(data || []);
                else setError(fetchError || 'Failed to fetch students');
            }
        } catch (err) {
            setError('An error occurred while fetching');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUsername || !newPassword) return;

        setIsSubmitting(true);
        setSuccessMessage('');
        setError('');

        try {
            const result = await createStudent({
                username: newUsername,
                password: newPassword,
                className: teacherClass
            });

            if (result.success) {
                setSuccessMessage(`Student ${newUsername} created successfully in ${teacherClass}!`);
                setNewUsername('');
                setNewPassword('');
                const { students: data } = await getStudentsByClass(teacherClass);
                setStudents(data || []);
            } else {
                setError(result.error || 'Failed to create student');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCsvUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!csvFile) return;

        setIsUploading(true);
        setSuccessMessage('');
        setError('');

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n');
            const studentData: { username: string; password: string }[] = [];

            lines.forEach((line, index) => {
                if (!line.trim() || index === 0 && line.toLowerCase().includes('username')) return;
                const [username, password] = line.split(',').map(s => s.trim());
                if (username && password) {
                    studentData.push({ username, password });
                }
            });

            if (studentData.length === 0) {
                setError('No valid student data found in CSV');
                setIsUploading(false);
                return;
            }

            try {
                const result = await bulkCreateStudents(studentData, teacherClass);
                if (result.success) {
                    setSuccessMessage(`Successfully uploaded ${result.successCount} students to ${teacherClass}. ${result.failedCount} failed.`);
                    if (result.errors.length > 0) {
                        console.error('Upload errors:', result.errors);
                    }
                    const { students: data } = await getStudentsByClass(teacherClass);
                    setStudents(data || []);
                    setCsvFile(null);
                } else {
                    setError(result.error || 'Bulk upload failed');
                }
            } catch (err) {
                setError('An error occurred during upload');
            } finally {
                setIsUploading(false);
            }
        };
        reader.readAsText(csvFile);
    };

    if (isLoading && results.length === 0 && students.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error && !isLoading && view === 'results') {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-white p-12 rounded-[40px] shadow-xl border border-slate-100 max-w-md w-full">
                    <p className="text-red-500 font-black text-xl mb-4">Error loading dashboard</p>
                    <p className="text-slate-500 font-medium mb-8">{error}</p>
                    <Link href="/login?role=TEACHER" className="inline-block px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-colors">
                        Return to Login
                    </Link>
                </div>
            </div>
        );
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
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Teacher Console</h1>
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">
                                <Filter size={10} className="text-indigo-400" />
                                <span>Class: {teacherClass}</span>
                            </div>
                        </div>
                    </div>

                    <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
                        <button
                            onClick={() => setView('results')}
                            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${view === 'results' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Results
                        </button>
                        <button
                            onClick={() => setView('students')}
                            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${view === 'students' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Manage Students
                        </button>
                    </nav>

                    <Link href="/" onClick={() => window.localStorage.removeItem('spellex-user')} className="text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase text-xs tracking-widest">Sign Out</Link>
                </div>
            </header>

            <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                {view === 'results' ? (
                    <>
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
                                <span className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">{teacherClass} Live Feed</span>
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
                                    No student results found for {teacherClass}.
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Student List */}
                        <div className="lg:col-span-2 bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden h-fit">
                            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">Class Roster</h2>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Total: {students.length} Students</p>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search class..."
                                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all font-semibold"
                                    />
                                </div>
                            </div>

                            <div className="max-h-[600px] overflow-y-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 sticky top-0 z-[5]">
                                            <th className="px-10 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Class</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Joined</th>
                                            <th className="px-10 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {students.map((student) => (
                                            <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-10 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-black text-xs">
                                                            {student.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-bold text-slate-700">{student.username}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase">
                                                        {student.className}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-center text-slate-400 font-bold text-xs">
                                                    {new Date(student.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-10 py-5 text-right">
                                                    <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {students.length === 0 && (
                                    <div className="p-20 text-center text-slate-300 font-bold text-lg italic">
                                        No students in this class yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Control Panel */}
                        <div className="space-y-8">
                            {/* Alert Messages */}
                            {successMessage && (
                                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
                                    <CheckCircle2 size={20} className="mt-0.5" />
                                    <div>
                                        <p className="font-black text-sm uppercase tracking-wider">Success</p>
                                        <p className="text-sm font-semibold">{successMessage}</p>
                                    </div>
                                    <button onClick={() => setSuccessMessage('')} className="ml-auto text-emerald-400 hover:text-emerald-600">
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-start gap-3 animate-in bounce-in">
                                    <AlertCircle size={20} className="mt-0.5" />
                                    <div>
                                        <p className="font-black text-sm uppercase tracking-wider">Error</p>
                                        <p className="text-sm font-semibold">{error}</p>
                                    </div>
                                    <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            {/* Manual Entry */}
                            <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                        <UserPlus size={20} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900">Manual Entry</h3>
                                </div>
                                <form onSubmit={handleCreateStudent} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Student ID / Username</label>
                                        <input
                                            type="text"
                                            required
                                            value={newUsername}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            className="w-full mt-1 px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold"
                                            placeholder="e.g. jsmith24"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Temporary Password</label>
                                        <input
                                            type="text"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full mt-1 px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold"
                                            placeholder="e.g. Welcome2024"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Creating...' : 'Register Student'}
                                    </button>
                                </form>
                            </div>

                            {/* Bulk Upload */}
                            <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />

                                <div className="flex items-center gap-3 mb-6 relative z-10">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                        <Upload size={20} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900">Bulk Upload</h3>
                                </div>

                                <p className="text-sm text-slate-500 font-medium mb-6 relative z-10 leading-relaxed">
                                    Upload a single CSV file with the following format: <br />
                                    <code className="bg-slate-100 px-2 py-0.5 rounded text-indigo-600 font-bold">username, password</code>
                                </p>

                                <form onSubmit={handleCsvUpload} className="space-y-4 relative z-10">
                                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer group/file relative">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="text-slate-300 group-hover/file:text-emerald-500 transition-colors" size={24} />
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                                {csvFile ? csvFile.name : 'Select CSV File'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!csvFile || isUploading}
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-black active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {isUploading ? 'Uploading...' : 'Process CSV Bulk'}
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors"
                                    >
                                        <Download size={12} /> Download Template
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
