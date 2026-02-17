# Spelling Assessment App Plan

This app automates the spelling assessment detailed in `2.pdf`. It supports audio-based spelling, passage dictation, multiple-choice spelling, and paragraph correction with advanced marking logic.

## User Review Required

> [!IMPORTANT]
> **Assumptions**: Since explicit answers to the Socratic Gate were skipped, I am proceeding with the following high-level design:
> 1. **Tech Stack**: Next.js (React) + Tailwind CSS + Lucide Icons for a premium, responsive web experience.
> 2. **Authentication**: Simple Clerk or Auth.js integration for student logins (or a local mock if offline-only is preferred).
> 3. **Audio**: Local file hosting (`/public/audio`) for the initial version.
> 4. **Part 5 Logic**: We will use a "Best Match" scanning algorithm. If a student skips a word, the system will look ahead to find the next correct match rather than strictly marking based on field index.

> [!WARNING]
> **Edge Case Question 1**: How should the system handle multiple spelling attempts? Is it "one and done," or can students re-play audio and change their answer before submitting the entire section?
> **Edge Case Question 2**: For the dictation (Part 2), should there be a word limit or any specific auto-save functionality to prevent work loss during long passages?

## Requirements & Design Decisions

> [!IMPORTANT]
> **Core Requirements**:
> 1. **Unlimited Audio Replays**: Students can replay audio files as many times as needed before submission.
> 2. **Unlimited Edits**: Students can change their answers any time before clicking "Submit".
> 3. **Autosave**: The dictation passage (Part 2) will auto-save to `localStorage` to prevent work loss.
> 4. **No Word Limits**: No artificial constraints on text length in any section.
> 5. **Part 5 Marking**: Use a "Best Match" algorithm to handle skipped words. If a student skips "camped" but corrects "brightest", they get the point for "brightest".

## Proposed Changes

---

### Core Infrastructure

#### [NEW] [Project Scaffolding] (file:///c:/Users/dsuth/OneDrive/Documents/Code%20Projects/SpellEx/)
*   Initialize Next.js app with TypeScript, Tailwind, and `lucide-react`.
*   Setup `useLocalStorage` hook for autosaving state.

### Data Layer

#### [NEW] `data/schema.ts`
*   Define `Assessment` schema. Each lesson (e.g., Lesson 6) will be a JSON object follow this schema.
*   `Part 1 & 3`: List of `{ id: number, word: string, audio: string }`.
*   `Part 2`: `{ audio: string, passageText: string }`.
*   `Part 4`: List of `{ sentence: string, options: string[], correct: string }`.
*   `Part 5`: `{ originalParagraph: string, errors: string[], corrections: string[] }`.

### Business Logic

#### [NEW] `lib/marking.ts`
*   `scorePart5(studentAnswers: string[], correctWords: string[])`:
    *   Initialize `totalScore = 0`.
    *   Iterate through each `correctWord`.
    *   Check if `correctWord` exists in the `studentAnswers` array *at or after* the current index pointer.
    *   If found: Increment score, update pointer.
    *   Return `totalScore`.

## Verification Plan

### Automated Tests
*   `npm run test`: Jest/Vitest for `lib/marking.ts` logic (specifically the skipped word scenario).
*   `python .agent/scripts/checklist.py .`: Full project audit.

### Manual Verification
*   Use the browser tool to walk through Lesson 6.
*   Test the "skip word" scenario in Part 5 to ensure subsequent words are marked correctly.
