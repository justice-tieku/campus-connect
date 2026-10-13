import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash("AdminDemo123!", 12);
  const studentHash = await bcrypt.hash("StudentDemo123!", 12);
  const teammateHash = await bcrypt.hash("TeammateDemo123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@campusconnect.dev" },
    update: {},
    create: {
      email: "admin@campusconnect.dev",
      passwordHash: adminHash,
      role: "ADMIN",
      profile: {
        create: {
          biography: "CampusConnect administrator. Moderates projects and opportunities.",
          institution: "CampusConnect University",
          programme: "Student Affairs",
          skills: ["Moderation", "Community"],
        },
      },
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@campusconnect.dev" },
    update: {},
    create: {
      email: "student@campusconnect.dev",
      passwordHash: studentHash,
      role: "STUDENT",
      profile: {
        create: {
          biography: "Computer science student looking for teammates on campus tools.",
          institution: "CampusConnect University",
          programme: "BSc Computer Science",
          skills: ["TypeScript", "React", "PostgreSQL"],
          githubLink: "https://github.com/example/campusconnect-student",
          portfolioLink: "https://example.com/portfolio",
          imageUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Amina",
        },
      },
    },
  });

  const teammate = await prisma.user.upsert({
    where: { email: "teammate@campusconnect.dev" },
    update: {},
    create: {
      email: "teammate@campusconnect.dev",
      passwordHash: teammateHash,
      role: "STUDENT",
      profile: {
        create: {
          biography: "Design-focused student interested in civic tech and campus life apps.",
          institution: "CampusConnect University",
          programme: "BA Interaction Design",
          skills: ["Figma", "UX Research", "React"],
          imageUrl: "https://api.dicebear.com/9.x/initials/svg?seed=Jordan",
        },
      },
    },
  });

  const existing = await prisma.project.findFirst({
    where: { title: "Study Group Matcher", creatorId: student.id },
  });

  if (!existing) {
    const project = await prisma.project.create({
      data: {
        title: "Study Group Matcher",
        description:
          "Match students in the same modules into small study groups based on availability and learning style. Looking for a designer and a backend teammate.",
        requiredSkills: ["React", "UX Research", "Node.js"],
        status: "OPEN",
        teamCapacity: 4,
        creatorId: student.id,
      },
    });
    await prisma.projectMember.create({
      data: { projectId: project.id, userId: student.id },
    });

    await prisma.project.create({
      data: {
        title: "Campus Event Radar",
        description:
          "A lightweight board of club events and internships with filters by faculty and skill. Open to collaborators.",
        requiredSkills: ["TypeScript", "PostgreSQL"],
        status: "IN_PROGRESS",
        teamCapacity: 5,
        creatorId: student.id,
        members: { create: { userId: student.id } },
      },
    });
  }

  const opp = await prisma.opportunity.findFirst({
    where: { title: "Summer Product Internship — Civic Labs" },
  });
  if (!opp) {
    await prisma.opportunity.create({
      data: {
        title: "Summer Product Internship — Civic Labs",
        description:
          "Paid internship helping universities ship student-facing tools. Remote-friendly with weekly campus office hours.",
        type: "INTERNSHIP",
        link: "https://example.com/internships/civic-labs",
        createdById: admin.id,
      },
    });
    await prisma.opportunity.create({
      data: {
        title: "Hack for Campus Week",
        description: "48-hour hackathon focused on student wellbeing and timetable tools. Teams of 2–5.",
        type: "EVENT",
        createdById: admin.id,
      },
    });
  }

  console.log("Seeded demo users:");
  console.log("  admin@campusconnect.dev / AdminDemo123!");
  console.log("  student@campusconnect.dev / StudentDemo123!");
  console.log("  teammate@campusconnect.dev / TeammateDemo123!");
  console.log(`  (ids) admin=${admin.id} student=${student.id} teammate=${teammate.id}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
