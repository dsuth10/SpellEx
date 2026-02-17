export interface Assessment {
  lessonId: string;
  title: string;
  totalPoints: number;
  parts: {
    part1: Part1And3;
    part2: Part2;
    part3: Part1And3;
    part4: Part4;
    part5: Part5;
  };
}

export interface Part1And3 {
  title: string;
  items: {
    id: number;
    word: string;
    audio: string;
  }[];
}

export interface Part2 {
  title: string;
  audio: string;
  paragraphText: string;
  maxPoints: number;
}

export interface Part4 {
  title: string;
  items: {
    id: number;
    sentence: string;
    blanks: {
      options: string[];
      correct: string;
    }[];
  }[];
}

export interface Part5 {
  title: string;
  paragraph: string;
  targets: {
    wrong: string;
    right: string;
  }[];
}

export interface StudentProgress {
  lessonId: string;
  answers: {
    part1: string[];
    part2: string;
    part3: string[];
    part4: string[][];
    part5: string[];
  };
  lastUpdated: string;
}
