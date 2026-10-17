import { PrismaClient, OpportunityType, ProjectStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = "Password123!";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // 1. Demo users matching the new interface
  const maya = await prisma.user.upsert({
    where: { email: "maya@campusconnect.demo" },
    update: { password: passwordHash, passwordHash },
    create: {
      email: "maya@campusconnect.demo",
      password: passwordHash,
      passwordHash,
      role: "STUDENT",
      firstName: "Maya",
      lastName: "Chen",
      institution: "Stanford University",
      profile: {
        create: {
          institution: "Stanford University",
          biography: "Full-stack builder passionate about educational technology and collaboration tools.",
          skills: ["React", "TypeScript", "Figma"],
          experience: "Advanced",
          availability: "6–10 hours / week",
          githubLink: "https://github.com/mayachen",
          onboardingComplete: true,
        },
      },
    },
  });

  const leo = await prisma.user.upsert({
    where: { email: "leo@campusconnect.demo" },
    update: { password: passwordHash, passwordHash },
    create: {
      email: "leo@campusconnect.demo",
      password: passwordHash,
      passwordHash,
      role: "STUDENT",
      firstName: "Leo",
      lastName: "Martins",
      institution: "MIT",
      profile: {
        create: {
          institution: "MIT",
          biography: "Climate tech researcher building mobile tools for sustainable urban travel.",
          skills: ["Flutter", "Python", "Machine Learning"],
          experience: "Intermediate",
          availability: "10+ hours / week",
          githubLink: "https://github.com/leomartins",
          onboardingComplete: true,
        },
      },
    },
  });

  const amina = await prisma.user.upsert({
    where: { email: "amina@campusconnect.demo" },
    update: { password: passwordHash, passwordHash },
    create: {
      email: "amina@campusconnect.demo",
      password: passwordHash,
      passwordHash,
      role: "STUDENT",
      firstName: "Amina",
      lastName: "Yusuf",
      institution: "Oxford University",
      profile: {
        create: {
          institution: "Oxford University",
          biography: "Distributed systems engineer building community-powered accessibility reviews.",
          skills: ["React", "Node.js", "Java"],
          experience: "Advanced",
          availability: "6–10 hours / week",
          githubLink: "https://github.com/aminayusuf",
          onboardingComplete: true,
        },
      },
    },
  });

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@campusconnect.demo" },
    update: { password: passwordHash, passwordHash },
    create: {
      email: "admin@campusconnect.demo",
      password: passwordHash,
      passwordHash,
      role: "ADMIN",
      firstName: "Admin",
      lastName: "Staff",
      institution: "Campus Connect Global",
      profile: {
        create: {
          institution: "Campus Connect Global",
          biography: "Campus Connect platform administrator and university partner coordinator.",
          skills: ["Community", "Leadership"],
          onboardingComplete: true,
        },
      },
    },
  });

  // 2. Starter projects from the new interface
  const studySyncExisting = await prisma.project.findFirst({
    where: { title: "StudySync" },
  });

  if (!studySyncExisting) {
    const p1 = await prisma.project.create({
      data: {
        title: "StudySync",
        description:
          "A collaborative study planner that helps university teams share goals, notes, and accountability streaks.",
        category: "EdTech",
        roles: ["Frontend developer", "Product designer"],
        requiredSkills: ["React", "TypeScript", "Figma"],
        teamCapacity: 5,
        status: ProjectStatus.OPEN,
        creatorId: maya.id,
      },
    });
    await prisma.projectMember.create({ data: { projectId: p1.id, userId: maya.id } });

    const p2 = await prisma.project.create({
      data: {
        title: "GreenRoute",
        description:
          "A mobile-first tool for finding lower-emission routes and tracking sustainable travel habits.",
        category: "Climate",
        roles: ["Mobile developer", "Data scientist"],
        requiredSkills: ["Flutter", "Python", "Machine Learning"],
        teamCapacity: 4,
        status: ProjectStatus.OPEN,
        creatorId: leo.id,
      },
    });
    await prisma.projectMember.create({ data: { projectId: p2.id, userId: leo.id } });

    const p3 = await prisma.project.create({
      data: {
        title: "AccessMap",
        description:
          "Community-powered accessibility reviews for lecture halls, libraries, and public campus spaces.",
        category: "Social impact",
        roles: ["Backend developer"],
        requiredSkills: ["React", "Node.js", "Java"],
        teamCapacity: 6,
        status: ProjectStatus.IN_PROGRESS,
        creatorId: amina.id,
      },
    });
    await prisma.projectMember.create({ data: { projectId: p3.id, userId: amina.id } });
  }

  // 3. Internships matching the new interface
  const existingInternship = await prisma.opportunity.findFirst({
    where: { title: "Software Engineering Intern" },
  });

  if (!existingInternship) {
    await prisma.opportunity.create({
      data: {
        title: "Software Engineering Intern",
        description: "Join Northstar Labs to build scalable web applications.",
        company: "Northstar Labs",
        location: "Remote",
        skills: ["React", "TypeScript"],
        link: "https://www.linkedin.com/jobs/",
        type: OpportunityType.INTERNSHIP,
        createdById: admin.id,
      },
    });

    await prisma.opportunity.create({
      data: {
        title: "Data & AI Intern",
        description: "Collaborate on machine learning models and public impact data initiatives.",
        company: "CivicWorks",
        location: "Hybrid · London",
        skills: ["Python", "Machine Learning"],
        link: "https://www.linkedin.com/jobs/",
        type: OpportunityType.INTERNSHIP,
        createdById: admin.id,
      },
    });
  }

  console.log("Database seeded successfully with new interface data!");
  console.log("Demo credentials: Password123! for all accounts:");
  console.log("  - maya@campusconnect.demo");
  console.log("  - leo@campusconnect.demo");
  console.log("  - amina@campusconnect.demo");
  console.log("  - admin@campusconnect.demo");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
