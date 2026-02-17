"use server";

import { prisma } from "./prisma";

export async function submitAssessment(data: {
    username: string;
    lessonId: string;
    assessmentName: string;
    part1Score: number;
    part2Score: number;
    part3Score: number;
    part4Score: number;
    part5Score: number;
    totalScore: number;
}) {
    try {
        // Find the student user first
        const user = await prisma.user.findUnique({
            where: { username: data.username },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Save the result
        const result = await prisma.assessmentResult.create({
            data: {
                studentId: user.id,
                lessonId: data.lessonId,
                assessmentName: data.assessmentName,
                part1Score: data.part1Score,
                part2Score: data.part2Score,
                part3Score: data.part3Score,
                part4Score: data.part4Score,
                part5Score: data.part5Score,
                totalScore: data.totalScore,
            },
        });

        return { success: true, resultId: result.id };
    } catch (error) {
        console.error("Submission error:", error);
        return { success: false, error: "Failed to save result" };
    }
}

export async function getAllResults() {
    try {
        const results = await prisma.assessmentResult.findMany({
            include: {
                student: {
                    select: {
                        username: true,
                    },
                },
            },
            orderBy: {
                submittedAt: "desc",
            },
        });

        return { success: true, results };
    } catch (error) {
        console.error("Fetch error:", error);
        return { success: false, error: "Failed to fetch results" };
    }
}
