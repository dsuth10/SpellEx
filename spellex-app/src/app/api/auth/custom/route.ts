import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { username, password, role, isRegistering } = await req.json();

        if (!username || !password) {
            return NextResponse.json(
                { message: "Username and password are required" },
                { status: 400 }
            );
        }

        if (isRegistering) {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { username },
            });

            if (existingUser) {
                return NextResponse.json(
                    { message: "Username already taken" },
                    { status: 400 }
                );
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    role: role || "STUDENT",
                },
            });

            // In a real app, we'd set a session cookie here. 
            // For this implementation, we'll return the user info.
            return NextResponse.json({
                message: "User created successfully",
                user: { id: user.id, username: user.username, role: user.role }
            });
        } else {
            // Login logic
            const user = await prisma.user.findUnique({
                where: { username },
            });

            if (!user) {
                return NextResponse.json(
                    { message: "Invalid credentials" },
                    { status: 401 }
                );
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return NextResponse.json(
                    { message: "Invalid credentials" },
                    { status: 401 }
                );
            }

            // Check role if specified
            if (role && user.role !== role) {
                return NextResponse.json(
                    { message: `Unauthorized: User is not a ${role}` },
                    { status: 403 }
                );
            }

            return NextResponse.json({
                message: "Login successful",
                user: { id: user.id, username: user.username, role: user.role }
            });
        }
    } catch (error) {
        console.error("Auth error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
