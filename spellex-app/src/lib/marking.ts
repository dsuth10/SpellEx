export function scorePart1And3(studentAnswers: string[], correctWords: string[]): number {
    let score = 0;
    studentAnswers.forEach((answer, index) => {
        if (answer.trim().toLowerCase() === correctWords[index].toLowerCase()) {
            score++;
        }
    });
    return score;
}

export function scorePart4(studentAnswers: string[][], selections: { correct: string }[][]): number {
    let score = 0;
    studentAnswers.forEach((sentenceAnswers, sIndex) => {
        sentenceAnswers.forEach((answer, aIndex) => {
            if (answer === selections[sIndex][aIndex].correct) {
                score++;
            }
        });
    });
    return score;
}

/**
 * Best Match Marking Logic for Part 5
 * If a student misses a word, it should still mark the rest correctly.
 */
export function scorePart5(studentAnswers: string[], correctWords: string[]): { score: number; results: boolean[] } {
    let score = 0;
    let answerPointer = 0;
    const results = new Array(correctWords.length).fill(false);

    for (let i = 0; i < correctWords.length; i++) {
        const target = correctWords[i].toLowerCase();

        // Look ahead in student answers to find a match for the current target
        for (let j = answerPointer; j < studentAnswers.length; j++) {
            if (studentAnswers[j]?.trim().toLowerCase() === target) {
                score++;
                answerPointer = j + 1; // Move pointer past this match
                results[i] = true;
                break;
            }
        }
    }

    return { score, results };
}
