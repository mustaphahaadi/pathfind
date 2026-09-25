import type { Mentor } from "../types/mentor";

export const mentors: Mentor[] = [
  {
    id: "akosua-boateng",
    name: "Akosua Boateng",
    role: "Principal Product Designer",
    company: "Hubtel",
    imageUrl:
      "https://images.unsplash.com/photo-1589156215223-fe5e57df7572?w=400&h=500&fit=crop&crop=faces&q=80",
    category: "UX & Product Design",
    trackId: "ui-ux-design",
    tags: ["Career Transition", "Design Systems", "Figma Mentorship", "Portfolio Critique"],
    available: true,
    verified: true,
    rating: 5,
    reviewCount: 42,
    sessionsGiven: 42,
    bio: "I transitioned from graphic design into digital product design 8 years ago right here in Accra. I specialize in helping non-traditional career switchers craft narrative portfolios, navigate case studies, and master Figma design systems from zero.",
    nextOpening: "Tomorrow, 6:00 PM GMT",
    sessionFormat: "1:1 Video (45m)",
    durationMinutes: 45,
    matchScore: 98,
    location: "Accra, Ghana (GMT)",
    language: "English, Twi",
    attendanceRate: 100,
    responseTime: "Usually responds in 3 hours",
    philosophy:
      "Great design careers aren't built on talent alone — they're built on narrative. I help people find the through-line in their story and defend it with confidence.",
    aboutParagraphs: [
      "Hi, I'm Akosua. I lead product design at Hubtel, Ghana's leading mobile commerce platform, working across design systems, payments UX, and the craft that ties them together.",
      "Before Hubtel I was a design lead at mPharma, and before that I was a working graphic artist with zero formal UX training. I volunteer on Pathfind because someone once gave me 45 minutes that changed my trajectory — I'm just passing it forward.",
    ],
    skillGroups: [
      {
        groupLabel: "Design Systems & Craft",
        skills: ["Design Systems", "Figma Architecture", "Prototyping", "Component Libraries"],
      },
      {
        groupLabel: "Career Development",
        skills: ["Portfolio Storytelling", "Case Study Structure", "Career Transition"],
      },
    ],
    experience: [
      {
        title: "Principal Product Designer",
        org: "Hubtel",
        location: "Accra, Ghana",
        period: "2021 — Present",
        description:
          "Leading design systems and payments UX used by millions of Ghanaians daily.",
      },
      {
        title: "Design Lead",
        org: "mPharma",
        location: "Accra, Ghana",
        period: "2017 — 2021",
        description:
          "Led design for patient trust & safety flows, and mentored a team of 6 product designers.",
      },
    ],
    reviews: [
      {
        reviewerName: "Abena N.",
        reviewerRole: "Junior Designer, career switcher",
        quote:
          "Akosua tore my portfolio apart in the best way. I rebuilt two case studies around her feedback and got three callbacks the same month.",
        sessionTopic: "Portfolio Critique",
        date: "September 2, 2024",
      },
      {
        reviewerName: "Kwabena T.",
        reviewerRole: "Bootcamp graduate",
        quote:
          "Zero fluff, all actionable. She showed me exactly how to structure a Figma file so hiring managers could actually follow my thinking.",
        sessionTopic: "Figma Mentorship",
        date: "August 14, 2024",
      },
    ],
  },
  {
    id: "kwame-mensah",
    name: "Kwame Mensah",
    role: "Staff Backend Architect",
    company: "AmaliTech",
    imageUrl:
      "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=500&fit=crop&crop=faces&q=80",
    category: "Software Engineering",
    trackId: "software-engineering",
    tags: ["Python & FastAPI", "Self-Taught Path", "Code Reviews", "Backend Systems"],
    available: true,
    verified: true,
    rating: 5,
    reviewCount: 68,
    sessionsGiven: 36,
    bio: "Self-taught developer with 10+ years in the industry building backend systems across Ghana and West Africa. I love breaking down complex API architectures into intuitive mental models for beginner engineers.",
    nextOpening: "Thursday, 7:00 PM GMT",
    sessionFormat: "1:1 Video or Code Review",
    durationMinutes: 45,
    matchScore: 93,
    location: "Accra, Ghana (GMT)",
    language: "English, Twi",
    attendanceRate: 98,
    responseTime: "Usually responds in 4 hours",
    philosophy:
      "You don't need a CS degree to think like an architect — you need mental models. I teach the models, not just the syntax.",
    aboutParagraphs: [
      "Hi, I'm Kwame. I lead backend architecture at AmaliTech, working on the systems that power digital services for clients across Africa and Europe.",
      "I taught myself to code from YouTube tutorials and Stack Overflow after a business administration degree. I mentor self-taught and bootcamp engineers because I know exactly how disorienting that path can feel from the inside.",
    ],
    skillGroups: [
      {
        groupLabel: "Backend Architecture",
        skills: ["Python", "FastAPI", "PostgreSQL", "AWS"],
      },
      {
        groupLabel: "Career Development",
        skills: ["Self-Taught Path", "Code Reviews", "Mock Interviews"],
      },
    ],
    experience: [
      {
        title: "Staff Backend Architect",
        org: "AmaliTech",
        location: "Accra, Ghana",
        period: "2020 — Present",
        description: "Owns backend architecture standards across 40+ client engineering teams.",
      },
      {
        title: "Senior Backend Engineer",
        org: "Rancard Solutions",
        location: "Accra, Ghana",
        period: "2015 — 2020",
        description: "Built and scaled SMS & USSD platforms serving millions of Ghanaian users.",
      },
    ],
    reviews: [
      {
        reviewerName: "Kofi K.",
        reviewerRole: "Self-taught developer",
        quote:
          "Kwame explained Python async programming in a way that finally clicked after months of confusion. Worth ten YouTube tutorials.",
        sessionTopic: "Code Reviews",
        date: "October 1, 2024",
      },
      {
        reviewerName: "Ama A.",
        reviewerRole: "Junior engineer",
        quote:
          "He reviewed my actual PR live on the call and explained his reasoning for every comment. Incredibly generous with his time.",
        sessionTopic: "Backend Systems",
        date: "September 19, 2024",
      },
    ],
  },
  {
    id: "kofi-asante",
    name: "Kofi Asante",
    role: "Engineering Lead",
    company: "Zeepay",
    imageUrl:
      "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=500&fit=crop&crop=faces&q=80",
    category: "Software Engineering",
    trackId: "software-engineering",
    tags: ["Fullstack Web", "React & TypeScript", "Junior Mentorship", "Career Roadmapping"],
    available: true,
    verified: true,
    rating: 5,
    reviewCount: 39,
    sessionsGiven: 58,
    bio: "Passionate about bridging UI/UX intuition with solid software engineering. I help bootcamp graduates and self-taught developers build real-world fullstack projects that stand out to hiring managers across West Africa.",
    nextOpening: "Friday, 5:00 PM GMT",
    sessionFormat: "1:1 Video (30m)",
    durationMinutes: 30,
    matchScore: 95,
    location: "Takoradi, Ghana (GMT)",
    language: "English, Fante",
    attendanceRate: 100,
    responseTime: "Usually responds in 1 hour",
    philosophy:
      "The gap between 'I can code' and 'I got hired' is almost always project quality and communication, not raw skill. I coach both.",
    aboutParagraphs: [
      "Hi, I'm Kofi. I lead the core product engineering team at Zeepay, working across the fullstack from design systems to infrastructure powering cross-border remittances.",
      "I bootcamp-switched into tech from an accounting career six years ago. I mentor junior and self-taught engineers on making their portfolio projects look and feel production-ready, not like tutorials.",
    ],
    skillGroups: [
      {
        groupLabel: "Fullstack Engineering",
        skills: ["React", "TypeScript", "Node.js", "API Design"],
      },
      {
        groupLabel: "Career Development",
        skills: ["Junior Mentorship", "Career Roadmapping", "Portfolio Projects"],
      },
    ],
    experience: [
      {
        title: "Engineering Lead",
        org: "Zeepay",
        location: "Takoradi, Ghana",
        period: "2022 — Present",
        description: "Leads a team of 8 engineers across the core fintech product surface.",
      },
      {
        title: "Software Engineer",
        org: "Vodafone Ghana",
        location: "Accra, Ghana",
        period: "2017 — 2022",
        description: "Built internal tooling for the mobile money platform, scaling to millions of daily transactions.",
      },
    ],
    reviews: [
      {
        reviewerName: "Yaw L.",
        reviewerRole: "Bootcamp graduate",
        quote:
          "Kofi rebuilt my mental model of what a 'portfolio-ready' project actually looks like. I shipped a real deploy the same week.",
        sessionTopic: "React & TypeScript",
        date: "September 27, 2024",
      },
      {
        reviewerName: "Efua C.",
        reviewerRole: "Career switcher",
        quote:
          "Practical, kind, and direct. He gave me a 90-day roadmap I actually followed and it worked.",
        sessionTopic: "Career Roadmapping",
        date: "August 30, 2024",
      },
    ],
  },
  {
    id: "abena-owusu",
    name: "Abena Owusu",
    role: "Fullstack Tech Lead",
    company: "MTN Ghana",
    imageUrl:
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=500&fit=crop&crop=faces&q=80",
    category: "Software Engineering",
    trackId: "software-engineering",
    tags: ["Career Switching", "Interview Preparation", "System Architecture", "Resume Review"],
    available: false,
    verified: true,
    rating: 5,
    reviewCount: 51,
    sessionsGiven: 47,
    bio: "I love mentoring engineers entering the tech industry in Ghana. I provide realistic interview prep, CV teardowns, and actionable tips on how to effectively communicate technical decisions.",
    nextOpening: "Monday, 6:00 PM GMT",
    sessionFormat: "1:1 Video (45m)",
    durationMinutes: 45,
    matchScore: 88,
    location: "Kumasi, Ghana (GMT)",
    language: "English, Twi",
    attendanceRate: 96,
    responseTime: "Usually responds in 6 hours",
    philosophy:
      "Interviews are a communication skill, not just a technical one. I coach people to narrate their thinking, not just arrive at the right answer.",
    aboutParagraphs: [
      "Hi, I'm Abena. I lead a fullstack team at MTN Ghana working on internal tooling for the MoMo (Mobile Money) platform.",
      "I've sat on both sides of hundreds of interview loops. I volunteer on Pathfind to demystify the process for people who don't have an insider coaching them through it.",
    ],
    skillGroups: [
      {
        groupLabel: "Systems & Architecture",
        skills: ["System Architecture", "API Design", "Scalability"],
      },
      {
        groupLabel: "Interview Coaching",
        skills: ["Interview Preparation", "Resume Review", "Career Switching"],
      },
    ],
    experience: [
      {
        title: "Fullstack Tech Lead",
        org: "MTN Ghana",
        location: "Kumasi, Ghana",
        period: "2020 — Present",
        description: "Leads platform tooling for the MoMo mobile money organization.",
      },
      {
        title: "Software Engineer",
        org: "Farmerline",
        location: "Accra, Ghana",
        period: "2016 — 2020",
        description: "Built backend services for the agri-tech platform connecting 500,000+ smallholder farmers.",
      },
    ],
    reviews: [
      {
        reviewerName: "Nana R.",
        reviewerRole: "Career switcher",
        quote:
          "Abena's mock interview was harder than my actual onsite. I walked in prepared and got the offer.",
        sessionTopic: "Interview Preparation",
        date: "July 22, 2024",
      },
      {
        reviewerName: "Gifty O.",
        reviewerRole: "Junior engineer",
        quote:
          "She rewrote three bullet points on my resume and I started getting callbacks within a week.",
        sessionTopic: "Resume Review",
        date: "July 10, 2024",
      },
    ],
  },
  {
    id: "nana-yeboah",
    name: "Nana Yeboah",
    role: "Senior Product Manager",
    company: "Fido",
    imageUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=faces&q=80",
    category: "Product Management",
    trackId: "product-management",
    tags: ["Product Strategy", "Engineering to PM", "Stakeholder Comms", "Mock Interviews"],
    available: true,
    verified: true,
    rating: 5,
    reviewCount: 113,
    sessionsGiven: 197,
    bio: "I help designers and engineers understand product strategy, cross-functional stakeholder dynamics, and how to present high-impact technical initiatives to executive leadership in Ghana's fast-growing tech ecosystem.",
    nextOpening: "Wednesday, 5:00 PM GMT",
    sessionFormat: "1:1 Video (30m)",
    durationMinutes: 45,
    matchScore: 91,
    location: "Accra, Ghana (GMT)",
    language: "English, Twi",
    attendanceRate: 100,
    responseTime: "Usually responds in 2 hours",
    philosophy:
      "Tech gatekeeping has historically excluded brilliant outsiders. I volunteer 100% of my advisory time to give first-generation graduates, career switchers, and ambitious Ghanaian operators the exact strategic frameworks, promotion navigation, and interview prep I had to piece together alone.",
    aboutParagraphs: [
      "Hi, I'm Nana. I currently lead product for Fido, Ghana's leading digital credit platform, helping thousands of Ghanaians access instant loans through mobile money.",
      "Before Fido, I spent nearly 4 years at Jumia scaling seller onboarding, marketplace discovery, and logistics operations across West Africa. I began my tech career by launching a bootstrapped agri-marketplace startup that failed quietly, but taught me every foundational lesson about customer discovery, 0-to-1 PM execution, and high-velocity shipping.",
      "Whether you need candid feedback on your product teardown, advice on managing high-stakes stakeholder conflicts, or a rigorous mock PM interview, my goal is to give you clarity and unfair leverage for your next step.",
    ],
    skillGroups: [
      {
        groupLabel: "Product Strategy & Execution",
        skills: [
          "Product Strategy",
          "0-to-1 Product Management",
          "Roadmap Prioritization",
          "Exec Stakeholder Communication",
        ],
      },
      {
        groupLabel: "Growth & Monetization",
        skills: [
          "Growth Modeling",
          "Monetization",
          "Unit Economics",
          "User Retention",
          "A/B Testing",
        ],
      },
      {
        groupLabel: "Leadership & Career Development",
        skills: ["Staff+ Career Coaching", "Mock PM Interviews"],
      },
    ],
    experience: [
      {
        title: "Senior Product Manager",
        org: "Fido",
        location: "Accra, Ghana",
        period: "2021 — Present",
        description:
          "Spearheading digital credit expansion for Ghana's fastest-growing fintech. Responsible for self-service loan optimization and credit scoring algorithm UX.",
      },
      {
        title: "Senior Product Manager, Marketplace",
        org: "Jumia",
        location: "Accra, Ghana",
        period: "2018 — 2021",
        description:
          "Led a squad of 14 engineers and data scientists delivering seller onboarding and marketplace discovery across West Africa.",
      },
      {
        title: "Co-Founder & Head of Product",
        org: "AgroConnect Ghana",
        location: "Accra, Ghana",
        period: "2016 — 2018",
        description:
          "Built and launched an agri-marketplace from 0 to 1,200 active farmers. Handled all customer discovery, wireframes, and seed pitch deck.",
      },
    ],
    reviews: [
      {
        reviewerName: "Adwoa K.",
        reviewerRole: "Associate Product Manager at Zeepay",
        quote:
          "Nana was extraordinarily tactical. We did a 45-minute product sense mock and his debrief was ten times more insightful than paid prep services. Received my official offer two weeks later!",
        sessionTopic: "Mock PM Interview",
        date: "October 12, 2024",
      },
      {
        reviewerName: "Emmanuel R.",
        reviewerRole: "Senior PM at FinTech Startup",
        quote:
          "What makes Nana special is his total lack of ego. He walked through our onboarding conversion drop-off curves and helped me restructure how I communicate metrics to our founders.",
        sessionTopic: "Growth Modeling & Metrics",
        date: "September 28, 2024",
      },
      {
        reviewerName: "Cynthia D.",
        reviewerRole: "Product Lead at SaaS Scale-up",
        quote:
          "Helped me assemble a rock-solid calibration artifact for my Staff PM promo packet. Nana pointed out two areas where I was underselling my team's impact. Promoted last month!",
        sessionTopic: "Staff / Senior PM Promotion",
        date: "August 19, 2024",
      },
    ],
  },
  {
    id: "yaw-ofori",
    name: "Yaw Ofori",
    role: "VP of Engineering",
    company: "Turaco",
    imageUrl:
      "https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?w=400&h=500&fit=crop&crop=faces&q=80",
    category: "Software Engineering",
    trackId: "devops-cloud",
    tags: ["Eng Leadership", "Team Scaling", "Cloud & DevOps", "Career Growth"],
    available: false,
    verified: true,
    rating: 5,
    reviewCount: 70,
    sessionsGiven: 82,
    bio: "Advising senior individual contributors transitioning to engineering management and scaling technical teams across Africa's rapidly growing tech sector.",
    nextOpening: "Waitlist only",
    sessionFormat: "1:1 Video (45m)",
    durationMinutes: 45,
    matchScore: 76,
    location: "Accra, Ghana (GMT)",
    language: "English, Twi, Ga",
    attendanceRate: 97,
    responseTime: "Usually responds in 8 hours",
    philosophy:
      "Management is a craft you can learn deliberately, the same way you learned to code. I teach the deliberate practice, not just the platitudes.",
    aboutParagraphs: [
      "Hi, I'm Yaw. I lead engineering at Turaco, scaling teams across the platform and embedded insurance operations across Africa.",
      "I made the jump from senior IC to manager twice — once badly, once well. I mentor engineers weighing that same transition, or already in it and looking for a sounding board.",
    ],
    skillGroups: [
      {
        groupLabel: "Engineering Leadership",
        skills: ["Eng Leadership", "Team Scaling", "Career Growth"],
      },
      {
        groupLabel: "Technical",
        skills: ["AWS", "Docker", "CI/CD", "Cloud Infrastructure"],
      },
    ],
    experience: [
      {
        title: "VP of Engineering",
        org: "Turaco",
        location: "Accra, Ghana",
        period: "2022 — Present",
        description: "Leads a 50-person engineering organization across 5 teams building embedded insurance.",
      },
      {
        title: "Director of Engineering",
        org: "Brimstone Insurance",
        location: "Accra, Ghana",
        period: "2018 — 2022",
        description: "Scaled the digital platform team from 6 to 30 engineers.",
      },
    ],
    reviews: [
      {
        reviewerName: "Kojo B.",
        reviewerRole: "Senior engineer weighing management",
        quote:
          "Yaw gave me the most honest breakdown of what the IC-to-manager switch actually costs and gains. No spin, just clarity.",
        sessionTopic: "Career Growth",
        date: "June 4, 2024",
      },
      {
        reviewerName: "Esi P.",
        reviewerRole: "New engineering manager",
        quote:
          "She walked me through her actual 1:1 framework. I started using it the next week and my team noticed immediately.",
        sessionTopic: "Team Scaling",
        date: "May 21, 2024",
      },
    ],
  },
  {
    id: "adwoa-addo",
    name: "Adwoa Addo",
    role: "Technical Writer",
    company: "Paystack",
    imageUrl:
      "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=400&h=500&fit=crop&crop=faces&q=80",
    category: "Technical Writing",
    trackId: "other",
    tags: ["API Docs", "Style Guides", "Editing"],
    available: true,
    verified: true,
    rating: 4.9,
    reviewCount: 18,
    sessionsGiven: 21,
    bio: "Helping engineers turn dense technical work into documentation that actually gets read — API references, style guides, and editing passes. Based in Accra, serving Africa's growing developer community.",
    nextOpening: "Monday, 9:00 AM GMT",
    sessionFormat: "Async Portfolio & Code Review",
    durationMinutes: 45,
    matchScore: 70,
    location: "Accra, Ghana (GMT)",
    language: "English, Twi",
    attendanceRate: 100,
    responseTime: "Usually responds in 1 day",
    philosophy:
      "Good documentation is a product surface, not an afterthought. I help engineers write docs their users actually finish reading.",
    aboutParagraphs: [
      "Hi, I'm Adwoa. I write and edit developer-facing documentation at Paystack, working across several public API surfaces used by thousands of Ghanaian and Nigerian businesses.",
      "I mentor engineers who want their writing — docs, RFCs, or promo packets — to land as clearly as their code does.",
    ],
    skillGroups: [
      {
        groupLabel: "Technical Writing",
        skills: ["API Docs", "Style Guides", "Editing"],
      },
    ],
    experience: [
      {
        title: "Technical Writer",
        org: "Paystack",
        location: "Accra, Ghana",
        period: "2019 — Present",
        description: "Writes and maintains developer documentation for Paystack's public API surfaces.",
      },
      {
        title: "Content Strategist",
        org: "Expresspay Ghana",
        location: "Accra, Ghana",
        period: "2016 — 2019",
        description: "Led documentation strategy for Expresspay's merchant-facing developer platform.",
      },
    ],
    reviews: [
      {
        reviewerName: "Kwesi S.",
        reviewerRole: "Backend engineer",
        quote:
          "Adwoa edited my API reference docs and the improvement in clarity was night and day. She explains the 'why' behind every edit.",
        sessionTopic: "API Docs",
        date: "May 9, 2024",
      },
      {
        reviewerName: "Mansa P.",
        reviewerRole: "Junior engineer",
        quote:
          "Helped me write a promo packet that didn't read like a diary. Concrete, structural feedback.",
        sessionTopic: "Editing",
        date: "April 22, 2024",
      },
    ],
  },
];
