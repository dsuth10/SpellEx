import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // --- Create Teacher ---
    const teacher = await prisma.user.upsert({
        where: { username: 'teacher_sarah' },
        update: {},
        create: {
            username: 'teacher_sarah',
            password: hashedPassword,
            role: 'TEACHER',
        },
    });

    console.log('✅ Teacher created:', teacher.username);

    // --- Create Students ---
    const studentsData = [
        { username: 'joshua_d', p1: 10, p2: 0, p3: 4, p4: 3, p5: 7 },
        { username: 'amy_w', p1: 12, p2: 0, p3: 5, p4: 4, p5: 9 },
        { username: 'ben_k', p1: 8, p2: 0, p3: 3, p4: 2, p5: 5 },
        { username: 'chloe_m', p1: 11, p2: 0, p3: 4, p4: 4, p5: 8 },
    ];

    for (const s of studentsData) {
        const student = await prisma.user.upsert({
            where: { username: s.username },
            update: {},
            create: {
                username: s.username,
                password: hashedPassword,
                role: 'STUDENT',
            },
        });

        // Create a mock assessment result for this student
        const total = s.p1 + s.p2 + s.p3 + s.p4 + s.p5;

        await prisma.assessmentResult.create({
            data: {
                studentId: student.id,
                lessonId: 'lesson-6',
                assessmentName: 'Lesson 6: Progress Monitoring 1',
                part1Score: s.p1,
                part2Score: s.p2,
                part3Score: s.p3,
                part4Score: s.p4,
                part5Score: s.p5,
                totalScore: total,
                submittedAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)), // Random date in last week
            },
        });

        console.log(`✅ Student & Result created: ${student.username} (Score: ${total}/50)`);
    }

    console.log('🌱 Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
