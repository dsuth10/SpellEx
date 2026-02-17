import { Assessment } from "../../types/assessment";

export const lesson6: Assessment = {
    lessonId: "lesson-6",
    title: "Lesson 6: Progress Monitoring 1",
    totalPoints: 50,
    parts: {
        part1: {
            title: "Part 1: Single word spelling",
            items: [
                { id: 1, word: "brightest", audio: "/audio/lesson-6/part1-1.mp3" },
                { id: 2, word: "camped", audio: "/audio/lesson-6/part1-2.mp3" },
                { id: 3, word: "spotted", audio: "/audio/lesson-6/part1-3.mp3" },
                { id: 4, word: "treasure", audio: "/audio/lesson-6/part1-4.mp3" },
                { id: 5, word: "breakfast", audio: "/audio/lesson-6/part1-5.mp3" },
                { id: 6, word: "hiding", audio: "/audio/lesson-6/part1-6.mp3" },
                { id: 7, word: "darted", audio: "/audio/lesson-6/part1-7.mp3" },
                { id: 8, word: "slipping", audio: "/audio/lesson-6/part1-8.mp3" },
                { id: 9, word: "ready", audio: "/audio/lesson-6/part1-9.mp3" },
                { id: 10, word: "trouble", audio: "/audio/lesson-6/part1-10.mp3" },
                { id: 11, word: "morning", audio: "/audio/lesson-6/part1-11.mp3" },
                { id: 12, word: "suddenly", audio: "/audio/lesson-6/part1-12.mp3" },
            ]
        },
        part2: {
            title: "Part 2: Passage dictation",
            audio: "/audio/lesson-6/dictation.mp3",
            paragraphText: "The full dictation passage text for lesson 6 should go here for reference.",
            maxPoints: 20
        },
        part3: {
            title: "Part 3: Tricky/useful words",
            items: [
                { id: 1, word: "honey", audio: "/audio/lesson-6/part3-1.mp3" },
                { id: 2, word: "thought", audio: "/audio/lesson-6/part3-2.mp3" },
                { id: 3, word: "water", audio: "/audio/lesson-6/part3-3.mp3" },
                { id: 4, word: "climb", audio: "/audio/lesson-6/part3-4.mp3" },
                { id: 5, word: "young", audio: "/audio/lesson-6/part3-5.mp3" },
            ]
        },
        part4: {
            title: "Part 4: Choose the correct spelling",
            items: [
                {
                    id: 1,
                    sentence: "I [blank1] the [blank2] hidden beneath the sand.",
                    blanks: [
                        { options: ["spoted", "spotted", "spottid"], correct: "spotted" },
                        { options: ["tresure", "tressure", "treasure"], correct: "treasure" }
                    ]
                },
                {
                    id: 2,
                    sentence: "The sky was [blank1] when we looked [blank2] the clouds.",
                    blanks: [
                        { options: ["sunny", "suny", "sunni"], correct: "sunny" },
                        { options: ["abuv", "above", "abov"], correct: "above" }
                    ]
                }
            ]
        },
        part5: {
            title: "Part 5: Editing",
            paragraph: "We campt overnight and woke to the brightist summer morning. After a brekfast of bread and hunny, we packed our things, reddy for our hike. Suddenly, I felt that we were being watched. I quickly checked for any truble nearby. Then I saw it! It was a young deer hidding behind a tall tree. With a flick of its tail, it dartted away, sliping silently into the leafy forest.",
            targets: [
                { wrong: "campt", right: "camped" },
                { wrong: "brightist", right: "brightest" },
                { wrong: "brekfast", right: "breakfast" },
                { wrong: "hunny", right: "honey" },
                { wrong: "reddy", right: "ready" },
                { wrong: "truble", "right": "trouble" },
                { wrong: "hidding", "right": "hiding" },
                { wrong: "dartted", "right": "darted" },
                { wrong: "sliping", "right": "slipping" }
            ]
        }
    }
};
