"use server";

import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

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

export async function getAllResults(className?: string) {
    try {
        const results = await prisma.assessmentResult.findMany({
            where: className ? {
                student: {
                    className: className
                }
            } : {},
            include: {
                student: {
                    select: {
                        username: true,
                        className: true,
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

export async function createStudent(data: {
    username: string;
    password: string;
    className: string;
}) {
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { username: data.username },
        });

        if (existingUser) {
            return { success: false, error: "Username already taken" };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create student
        await prisma.user.create({
            data: {
                username: data.username,
                password: hashedPassword,
                role: "STUDENT",
                className: data.className,
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Create student error:", error);
        return { success: false, error: "Failed to create student" };
    }
}

export async function bulkCreateStudents(students: { username: string; password: string }[], className: string) {
    try {
        const results = {
            successCount: 0,
            failedCount: 0,
            errors: [] as string[],
        };

        for (const student of students) {
            const createResult = await createStudent({
                username: student.username,
                password: student.password,
                className: className,
            });

            if (createResult.success) {
                results.successCount++;
            } else {
                results.failedCount++;
                results.errors.push(`${student.username}: ${createResult.error}`);
            }
        }

        return { success: true, ...results };
    } catch (error) {
        console.error("Bulk create error:", error);
        return { success: false, error: "Bulk creation failed" };
    }
}

export async function getStudentsByClass(className: string) {
    try {
        const students = await prisma.user.findMany({
            where: {
                className: className,
                role: "STUDENT",
            },
            select: {
                id: true,
                username: true,
                className: true,
                createdAt: true,
            },
            orderBy: {
                username: "asc",
            },
        });

        return { success: true, students };
    } catch (error) {
        console.error("Fetch students error:", error);
        return { success: false, error: "Failed to fetch students" };
    }
}
