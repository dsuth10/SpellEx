"use client";

import React, { useState, useMemo } from 'react';
import { lesson6 } from '@/data/lessons/lesson6';
import { SpellingInput, Dictation, Part4Choice, Part5Editing } from '@/components/AssessmentItems';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ChevronRight, ChevronLeft, CheckCircle, Trophy, RotateCcw, Save } from 'lucide-react';
import { scorePart1And3, scorePart4, scorePart5 } from '@/lib/marking';
import { cn } from '@/components/AssessmentItems';

export default function AssessmentPage() {
  const [currentPart, setCurrentPart] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [progress, setProgress] = useLocalStorage(`progress-${lesson6.lessonId}`, {
    part1: Array(lesson6.parts.part1.items.length).fill(''),
    part2: '',
    part3: Array(lesson6.parts.part3.items.length).fill(''),
    part4: lesson6.parts.part4.items.map(i => Array(i.blanks.length).fill('')),
    part5: Array(lesson6.parts.part5.targets.length).fill(''),
  });

  const scores = useMemo(() => {
    return {
      part1: scorePart1And3(progress.part1, lesson6.parts.part1.items.map(i => i.word)),
      part3: scorePart1And3(progress.part3, lesson6.parts.part3.items.map(i => i.word)),
      part4: scorePart4(progress.part4, lesson6.parts.part4.items.map(i => i.blanks)),
      part5: scorePart5(progress.part5, lesson6.parts.part5.targets.map(t => t.right)).score,
    };
  }, [progress]);

  const totalScore = scores.part1 + scores.part3 + scores.part4 + scores.part5;

  const updatePart1 = (index: number, val: string) => {
    const next = [...progress.part1];
    next[index] = val;
    setProgress({ ...progress, part1: next });
  };

  const updatePart3 = (index: number, val: string) => {
    const next = [...progress.part3];
    next[index] = val;
    setProgress({ ...progress, part3: next });
  };

  const updatePart4 = (itemIndex: number, blankIndex: number, val: string) => {
    const next = [...progress.part4];
    const itemNext = [...next[itemIndex]];
    itemNext[blankIndex] = val;
    next[itemIndex] = itemNext;
    setProgress({ ...progress, part4: next });
  };

  const updatePart5 = (index: number, val: string) => {
    const next = [...progress.part5];
    next[index] = val;
    setProgress({ ...progress, part5: next });
  };

  const resetAssessment = () => {
    if (confirm("Are you sure you want to reset all progress?")) {
      window.localStorage.removeItem(`progress-${lesson6.lessonId}`);
      window.location.reload();
    }
  };

  const renderPart = () => {
    switch (currentPart) {
      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-indigo-900 mb-8">{lesson6.parts.part1.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              {lesson6.parts.part1.items.map((item, idx) => (
                <SpellingInput
                  key={item.id}
                  id={item.id}
                  audio={item.audio}
                  value={progress.part1[idx]}
                  onChange={(val: string) => updatePart1(idx, val)}
                />
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-indigo-900 mb-8">{lesson6.parts.part2.title}</h2>
            <Dictation
              audio={lesson6.parts.part2.audio}
              value={progress.part2}
              onChange={(val: string) => setProgress({ ...progress, part2: val })}
            />
          </div>
        );
      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-indigo-900 mb-8">{lesson6.parts.part3.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              {lesson6.parts.part3.items.map((item, idx) => (
                <SpellingInput
                  key={item.id}
                  id={item.id}
                  audio={item.audio}
                  value={progress.part3[idx]}
                  onChange={(val: string) => updatePart3(idx, val)}
                />
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-8">{lesson6.parts.part4.title}</h2>
            {lesson6.parts.part4.items.map((item, idx) => (
              <div key={item.id} className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                <Part4Choice
                  sentence={item.sentence}
                  blanks={item.blanks}
                  values={progress.part4[idx]}
                  onChange={(bIdx: number, val: string) => updatePart4(idx, bIdx, val)}
                />
              </div>
            ))}
          </div>
        );
      case 5:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-indigo-900 mb-8">{lesson6.parts.part5.title}</h2>
            <Part5Editing
              paragraph={lesson6.parts.part5.paragraph}
              targetsLength={lesson6.parts.part5.targets.length}
              values={progress.part5}
              onChange={(idx: number, val: string) => updatePart5(idx, val)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl p-12 text-center border-b-[12px] border-emerald-500">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <Trophy size={48} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Assessment Completed!</h1>
          <p className="text-slate-500 text-xl mb-12">Great job, Joshua! Here is your summary:</p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Part 1', score: scores.part1, total: 12 },
              { label: 'Dictation', score: '--', total: 20 },
              { label: 'Part 3', score: scores.part3, total: 5 },
              { label: 'Part 4', score: scores.part4, total: 4 },
              { label: 'Editing', score: scores.part5, total: 9 },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">{item.label}</p>
                <p className="text-3xl font-black text-slate-800">{item.score} <span className="text-slate-300 text-xl">/ {item.total}</span></p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-xl hover:bg-indigo-700 transition"
            >
              Review My Answers
            </button>
            <button
              onClick={resetAssessment}
              className="flex items-center justify-center gap-2 w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition"
            >
              <RotateCcw size={18} /> Restart Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] shadow-xl overflow-hidden border border-slate-100">
        <header className="bg-indigo-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight">{lesson6.title}</h1>
            <p className="text-indigo-300 font-medium mt-1">Joshua Da-Sutha</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-indigo-300 tracking-tighter leading-none">Overall Progress</p>
              <p className="text-2xl font-black tracking-tighter">
                {totalScore} <span className="text-indigo-400 text-lg">/ 50</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-500/30 rounded-full flex items-center justify-center border border-indigo-400/30">
              <Save className="text-indigo-200 animate-pulse" size={20} />
            </div>
          </div>
        </header>

        <main className="p-8 min-h-[550px]">
          {renderPart()}
        </main>

        <footer className="bg-slate-50 border-t border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <button
            disabled={currentPart === 1}
            onClick={() => setCurrentPart(p => p - 1)}
            className="flex items-center gap-2 px-6 py-3 text-slate-500 font-bold disabled:opacity-30 hover:text-slate-800 transition"
          >
            <ChevronLeft size={20} /> Previous Section
          </button>

          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map(p => (
              <button
                key={p}
                onClick={() => setCurrentPart(p)}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-bold transition",
                  currentPart === p
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "bg-white text-slate-400 border border-slate-200 hover:border-indigo-300"
                )}
              >
                {p}
              </button>
            ))}
          </div>

          {currentPart < 5 ? (
            <button
              onClick={() => setCurrentPart(p => p + 1)}
              className="flex items-center justify-center gap-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 transition active:translate-y-0 w-full md:w-auto"
            >
              Continue <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={() => setIsSubmitted(true)}
              className="flex items-center justify-center gap-2 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:shadow-xl hover:shadow-emerald-200 hover:-translate-y-0.5 transition active:translate-y-0 w-full md:w-auto"
            >
              Finish Assessment <CheckCircle size={20} />
            </button>
          )}
        </footer>
      </div>
      <p className="text-center mt-8 text-slate-400 font-medium text-sm">Created with Antigravity Kit v2026</p>
    </div>
  );
}
