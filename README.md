# SpellEx Pro 🚀

A premium, full-stack platform designed to automate educational spelling assessments with robust marking logic and a premium user experience.

## ✨ Features

### 👨‍🎓 Student Assessment
- **Role Selection**: Dedicated entry path for students.
- **5-Part Assessment**: Covers Spelling (Parts 1 & 3), Dictation (Part 2), Multiple Choice Cloze (Part 4), and Editing (Part 5).
- **Interactive Audio**: Embedded audio players for spelling and dictation passages with unlimited replays.
- **Autosave**: Progress is saved to `localStorage` during the assessment to prevent data loss.
- **Immediate Results**: View a detailed summary of scores upon completion.

### 👩‍🏫 Teacher Console
- **Secure Access**: Password-protected dashboard for teachers.
- **Class Analytics**: Real-time stats on total submissions and average class scores.
- **Student Results Grid**: A comprehensive table showing detailed score breakdowns for every student.
- **Database Persistence**: All results are stored securely in a SQLite database.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [SQLite](https://sqlite.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Auth.js](https://authjs.dev/) (NextAuth) with custom bcrypt hashing.
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### 1. Prerequisite
Ensure you have [Node.js](https://nodejs.org/) installed.

### 2. Installation
Navigate to the app directory and install dependencies:
```powershell
cd spellex-app
npm install --legacy-peer-deps
```

### 3. Database Setup
Initialize the SQLite database and generate the Prisma client:
```powershell
npx prisma db push
npx prisma generate
```

### 4. Running Locally
Start the development server:
```powershell
npm run dev
```
Visit `http://localhost:3000` to see the app in action.

## 📁 Project Structure

- `spellex-app/src/app`: Next.js pages and API routes.
- `spellex-app/src/components`: Reusable UI components (Assessment items, layout).
- `spellex-app/src/lib`: Core logic (Marking algorithm, Prisma client, Server actions).
- `spellex-app/src/data`: Assessment data (Lesson 6 content).
- `spellex-app/prisma`: Database schema and migrations.
- `spellex-app/public`: Static assets (Audio files, icons).

## 📝 Marking Logic

The app uses a custom **"Best Match" algorithm** for the Editing section (Part 5). This allows students to receive points even if they skip a word, ensuring fair and accurate scoring for classroom use.

---
Created with ❤️ by Antigravity Digital Engine
