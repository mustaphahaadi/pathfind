import type { Mentor } from "../types/mentor";

export const mentors: Mentor[] = [
  {
    id: "sarah-jenkins",
    name: "Sarah Jenkins",
    role: "Principal Product Designer",
    company: "Figma",
    imageUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=faces&q=80",
    category: "UX & Product Design",
    trackId: "ui-ux-design",
    tags: ["Career Transition", "Design Systems", "Figma Mentorship", "Portfolio Critique"],
    available: true,
    verified: true,
    rating: 5,
    reviewCount: 42,
    sessionsGiven: 42,
    bio: "I transitioned from fine arts into digital product design 8 years ago. I specialize in helping non-traditional career switchers craft narrative portfolios, navigate case studies, and master Figma design systems from zero.",
    nextOpening: "Tomorrow, 4:30 PM PDT",
    sessionFormat: "1:1 Video (45m)",
    durationMinutes: 45,
    matchScore: 98,
    location: "Austin, USA (UTC-6)",
    language: "English",
    attendanceRate: 100,
    responseTime: "Usually responds in 3 hours",
    philosophy:
      "Great design careers aren't built on talent alone — they're built on narrative. I help people find the through-line in their story and defend it with confidence.",
    aboutParagraphs: [
      "Hi, I'm Sarah. I lead product design for Figma's collaboration surface, working across design systems, prototyping tools, and the craft that ties them together.",
      "Before Figma I was a design lead at Airbnb, and before that I was a working painter with zero formal design training. I volunteer on Pathfind because someone once gave me 45 minutes that changed my trajectory — I'm just passing it forward.",
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
        org: "Figma",
        location: "Remote",
        period: "2021 — Present",
        description:
          "Leading design systems and prototyping surfaces used by millions of designers and engineers.",
      },
      {
        title: "Design Lead",
        org: "Airbnb",
        location: "San Francisco, CA",
        period: "2017 — 2021",
        description:
          "Led design for host trust & safety flows, and mentored a team of 6 product designers.",
      },
    ],
    reviews: [
      {
        reviewerName: "Priya N.",
        reviewerRole: "Junior Designer, career switcher",
        quote:
          "Sarah tore my portfolio apart in the best way. I rebuilt two case studies around her feedback and got three callbacks the same month.",
        sessionTopic: "Portfolio Critique",
        date: "September 2, 2024",
      },
      {
        reviewerName: "Marcus T.",
        reviewerRole: "Bootcamp graduate",
        quote:
          "Zero fluff, all actionable. She showed me exactly how to structure a Figma file so hiring managers could actually follow my thinking.",
        sessionTopic: "Figma Mentorship",
        date: "August 14, 2024",
      },
    ],
  },
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    role: "Staff Frontend Architect",
    company: "Datadog",
    imageUrl:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=500&fit=crop&crop=faces&q=80",
    category: "Software Engineering",
    trackId: "software-engineering",
    tags: ["React & Next.js", "Self-Taught Path", "Code Reviews", "Frontend Systems"],
    available: true,
    verified: true,
    rating: 5,
    reviewCount: 68,
    sessionsGiven: 36,
    bio: "Self-taught developer with 10+ years in the industry. I love breaking down complex React architectures into intuitive mental models for beginner engineers and teaching how to think like a staff architect.",
    nextOpening: "Thursday, 10:00 AM EDT",
    sessionFormat: "1:1 Video or Code Review",
    durationMinutes: 45,
    matchScore: 93,
    location: "Berlin, Germany (UTC+1)",
    language: "English, Russian",
    attendanceRate: 98,
    responseTime: "Usually responds in 4 hours",
    philosophy:
      "You don't need a CS degree to think like an architect — you need mental models. I teach the models, not just the syntax.",
    aboutParagraphs: [
      "Hi, I'm Elena. I lead frontend architecture at Datadog, working on the systems that power dashboards for thousands of engineering teams.",
      "I taught myself to code from library books after a marketing degree left me unemployed during a recession. I mentor self-taught and bootcamp engineers because I know exactly how disorienting that path can feel from the inside.",
    ],
    skillGroups: [
      {
        groupLabel: "Frontend Architecture",
        skills: ["React & Next.js", "Frontend Systems", "Performance", "State Management"],
      },
      {
        groupLabel: "Career Development",
        skills: ["Self-Taught Path", "Code Reviews", "Mock Interviews"],
      },
    ],
    experience: [
      {
        title: "Staff Frontend Architect",
        org: "Datadog",
        location: "Berlin, Germany",
        period: "2020 — Present",
        description: "Owns frontend architecture standards across 40+ engineering teams.",
      },
      {
        title: "Senior Frontend Engineer",
        org: "Zalando",
        location: "Berlin, Germany",
        period: "2015 — 2020",
        description: "Built and scaled the checkout experience for one of Europe's largest e-commerce platforms.",
      },
    ],
    reviews: [
      {
        reviewerName: "Daniel K.",
        reviewerRole: "Self-taught developer",
        quote:
          "Elena explained React re-renders in a way that finally clicked after months of confusion. Worth ten YouTube tutorials.",
        sessionTopic: "Code Reviews",
        date: "October 1, 2024",
      },
      {
        reviewerName: "Fatima A.",
        reviewerRole: "Junior engineer",
        quote:
          "She reviewed my actual PR live on the call and explained her reasoning for every comment. Incredibly generous with her time.",
        sessionTopic: "Frontend Systems",
        date: "September 19, 2024",
      },
    ],
  },
  {
    id: "david-park",
    name: "David Park",
    role: "Engineering Lead",
    company: "Linear",
    imageUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=faces&q=80",
    category: "Software Engineering",
    trackId: "software-engineering",
    tags: ["Fullstack Web", "Design-to-Code", "Junior Mentorship", "Career Roadmapping"],
    available: true,
    verified: true,
    rating: 5,
    reviewCount: 39,
    sessionsGiven: 58,
    bio: "Passionate about bridging UI/UX intuition with solid software engineering. I help bootcamp graduates and self-taught developers build real-world fullstack projects that stand out to hiring managers.",
    nextOpening: "Friday, 1:00 PM PST",
    sessionFormat: "1:1 Video (30m)",
    durationMinutes: 30,
    matchScore: 95,
    location: "Seattle, USA (UTC-8)",
    language: "English, Korean",
    attendanceRate: 100,
    responseTime: "Usually responds in 1 hour",
    philosophy:
      "The gap between 'I can code' and 'I got hired' is almost always project quality and communication, not raw skill. I coach both.",
    aboutParagraphs: [
      "Hi, I'm David. I lead the core product engineering team at Linear, working across the fullstack from design systems to infrastructure.",
      "I bootcamp-switched into tech from a finance career eight years ago. I mentor junior and self-taught engineers on making their portfolio projects look and feel production-ready, not like tutorials.",
    ],
    skillGroups: [
      {
        groupLabel: "Fullstack Engineering",
        skills: ["Fullstack Web", "Design-to-Code", "API Design"],
      },
      {
        groupLabel: "Career Development",
        skills: ["Junior Mentorship", "Career Roadmapping", "Portfolio Projects"],
      },
    ],
    experience: [
      {
        title: "Engineering Lead",
        org: "Linear",
        location: "Seattle, WA",
        period: "2022 — Present",
        description: "Leads a team of 8 engineers across the core issue-tracking product surface.",
      },
      {
        title: "Software Engineer",
        org: "Amazon",
        location: "Seattle, WA",
        period: "2017 — 2022",
        description: "Built internal tooling for the retail fulfillment org, scaling to millions of daily events.",
      },
    ],
    reviews: [
      {
        reviewerName: "Jordan L.",
        reviewerRole: "Bootcamp graduate",
        quote:
          "David rebuilt my mental model of what a 'portfolio-ready' project actually looks like. I shipped a real deploy the same week.",
        sessionTopic: "Design-to-Code",
        date: "September 27, 2024",
      },
      {
        reviewerName: "Wei C.",
        reviewerRole: "Career switcher",
        quote:
          "Practical, kind, and direct. He gave me a 90-day roadmap I actually followed and it worked.",
        sessionTopic: "Career Roadmapping",
        date: "August 30, 2024",
      },
    ],
  },
  {
    id: "aisha-patel",
    name: "Aisha Patel",
    role: "Fullstack Tech Lead",
    company: "Netflix",
    imageUrl:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=500&fit=crop&crop=faces&q=80",
    category: "Software Engineering",
    trackId: "software-engineering",
    tags: ["Career Switching", "Interview Preparation", "System Architecture", "Resume Review"],
    available: false,
    verified: true,
    rating: 5,
    reviewCount: 51,
    sessionsGiven: 47,
    bio: "I love mentoring engineers entering the tech industry. I provide realistic interview prep, CV teardowns, and actionable tips on how to effectively communicate technical decisions.",
    nextOpening: "Monday, 3:00 PM PST",
    sessionFormat: "1:1 Video (45m)",
    durationMinutes: 45,
    matchScore: 88,
    location: "Los Angeles, USA (UTC-8)",
    language: "English, Hindi",
    attendanceRate: 96,
    responseTime: "Usually responds in 6 hours",
    philosophy:
      "Interviews are a communication skill, not just a technical one. I coach people to narrate their thinking, not just arrive at the right answer.",
    aboutParagraphs: [
      "Hi, I'm Aisha. I lead a fullstack team at Netflix working on internal tooling for the content platform.",
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
        org: "Netflix",
        location: "Los Angeles, CA",
        period: "2020 — Present",
        description: "Leads platform tooling for the content operations organization.",
      },
      {
        title: "Software Engineer",
        org: "Spotify",
        location: "New York, NY",
        period: "2016 — 2020",
        description: "Built backend services for the podcast discovery and recommendation surface.",
      },
    ],
    reviews: [
      {
        reviewerName: "Sam R.",
        reviewerRole: "Career switcher",
        quote:
          "Aisha's mock interview was harder than my actual onsite. I walked in prepared and got the offer.",
        sessionTopic: "Interview Preparation",
        date: "July 22, 2024",
      },
      {
        reviewerName: "Grace O.",
        reviewerRole: "Junior engineer",
        quote:
          "She rewrote three bullet points on my resume and I started getting callbacks within a week.",
        sessionTopic: "Resume Review",
        date: "July 10, 2024",
      },
    ],
  },
  {
    id: "marcus-webb",
    name: "Marcus Webb",
    role: "Senior Product Manager",
    company: "Stripe",
    imageUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&crop=faces&q=80",
    category: "Product Management",
    trackId: "product-management",
    tags: ["Product Strategy", "Engineering to PM", "Stakeholder Comms", "Mock Interviews"],
    available: true,
    verified: true,
    rating: 5,
    reviewCount: 113,
    sessionsGiven: 197,
    bio: "I help designers and engineers understand product strategy, cross-functional stakeholder dynamics, and how to present high-impact technical initiatives to executive leadership.",
    nextOpening: "Wednesday, 2:00 PM PST",
    sessionFormat: "1:1 Video (30m)",
    durationMinutes: 45,
    matchScore: 91,
    location: "New York, USA (UTC-5)",
    language: "English",
    attendanceRate: 100,
    responseTime: "Usually responds in 2 hours",
    philosophy:
      "Tech gatekeeping has historically excluded brilliant outsiders. I volunteer 100% of my advisory time to give first-generation graduates, career switchers, and ambitious underrepresented operators the exact strategic frameworks, promotion navigation, and interview prep that I had to piece together alone. No fluff, no monetization, just direct tactical support.",
    aboutParagraphs: [
      "Hi, I'm Marcus. I currently lead product for Billing Platform Expansion at Stripe, helping tens of thousands of software companies monetize and handle global recurring revenue at internet scale.",
      "Before Stripe, I spent nearly 4 years at Uber scaling driver incentives, surge algorithms, and global marketplace onboarding across 14 European and North American markets. I began my tech career by launching a bootstrapping marketplace startup that failed quietly, but taught me every foundational lesson about customer discovery, 0-to-1 PM execution, and high-velocity shipping.",
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
          "Pricing Architecture",
          "User Retention",
          "Metric Trees & Funnels",
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
        title: "Senior Product Manager (Staff Track)",
        org: "Stripe",
        location: "New York, NY",
        period: "2021 — Present",
        description:
          "Spearheading billing lifecycle expansion across enterprise SaaS customers. Responsible for self-service subscription optimization, developer API ergonomics, and cross-border payment rails scaling.",
      },
      {
        title: "Senior Product Manager, Driver Marketplace",
        org: "Uber",
        location: "San Francisco, CA",
        period: "2018 — 2021",
        description:
          "Led a squad of 14 engineers and data scientists delivering real-time pricing elasticity algorithms. Improved 60-day driver retention by 18% through gamified quest sequences and weekly payout clarity.",
      },
      {
        title: "Co-Founder & Head of Product",
        org: "Hatch Collective (YC W16 Track)",
        location: "Boston, MA",
        period: "2016 — 2018",
        description:
          "Built and launched an artisan supplier B2B marketplace from 0 to $1.2M GMV. Handled all customer discovery, wireframes, full-stack prototyping, and seed pitch deck formulation.",
      },
    ],
    reviews: [
      {
        reviewerName: "Amina K.",
        reviewerRole: "Associate Product Manager at Datadog",
        quote:
          "Marcus was extraordinarily tactical. We did a 45-minute product sense mock for a tier-1 company, and his debrief was ten times more insightful than paid prep services. He showed me how to structure ambiguous trade-offs and communicate with conviction. Received my official offer two weeks later!",
        sessionTopic: "Mock PM Interview",
        date: "October 12, 2024",
      },
      {
        reviewerName: "David Ramirez",
        reviewerRole: "Senior PM at FinTech Seed Startup",
        quote:
          "What makes Marcus special is his total lack of ego. He walked through our onboarding conversion drop-off curves and helped me restructure how I communicate metrics to our founders. The fact that Pathfind mentors do this voluntarily out of genuine care for the craft is incredible.",
        sessionTopic: "Growth Modeling & Metrics",
        date: "September 28, 2024",
      },
      {
        reviewerName: "Chloe Dupont",
        reviewerRole: "Product Lead at SaaS Scale-up",
        quote:
          "Helped me assemble a rock-solid calibration artifact for my Staff PM promo packet. Marcus pointed out two areas where I was underselling my team's architectural impact and showed me how Stripe calibrates senior candidates. Promoted last month!",
        sessionTopic: "Staff / Senior PM Promotion",
        date: "August 19, 2024",
      },
    ],
  },
  {
    id: "maya-lin",
    name: "Maya Lin",
    role: "VP of Engineering",
    company: "Vercel",
    imageUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=faces&q=80",
    category: "Software Engineering",
    trackId: "devops-cloud",
    tags: ["Eng Leadership", "Team Scaling", "Next.js", "Career Growth"],
    available: false,
    verified: true,
    rating: 5,
    reviewCount: 70,
    sessionsGiven: 82,
    bio: "Advising senior individual contributors transitioning to engineering management and scaling technical teams.",
    nextOpening: "Waitlist only",
    sessionFormat: "1:1 Video (45m)",
    durationMinutes: 45,
    matchScore: 76,
    location: "San Francisco, USA (UTC-8)",
    language: "English, Mandarin",
    attendanceRate: 97,
    responseTime: "Usually responds in 8 hours",
    philosophy:
      "Management is a craft you can learn deliberately, the same way you learned to code. I teach the deliberate practice, not just the platitudes.",
    aboutParagraphs: [
      "Hi, I'm Maya. I lead engineering at Vercel, scaling teams across the platform and developer experience organizations.",
      "I made the jump from senior IC to manager twice — once badly, once well. I mentor engineers weighing that same transition, or already in it and looking for a sounding board.",
    ],
    skillGroups: [
      {
        groupLabel: "Engineering Leadership",
        skills: ["Eng Leadership", "Team Scaling", "Career Growth"],
      },
      {
        groupLabel: "Technical",
        skills: ["Next.js", "Infrastructure", "Cloud Architecture"],
      },
    ],
    experience: [
      {
        title: "VP of Engineering",
        org: "Vercel",
        location: "San Francisco, CA",
        period: "2022 — Present",
        description: "Leads a 60-person engineering organization across 6 teams.",
      },
      {
        title: "Director of Engineering",
        org: "MongoDB",
        location: "New York, NY",
        period: "2018 — 2022",
        description: "Scaled the cloud platform team from 8 to 35 engineers.",
      },
    ],
    reviews: [
      {
        reviewerName: "Tomas B.",
        reviewerRole: "Senior engineer weighing management",
        quote:
          "Maya gave me the most honest breakdown of what the IC-to-manager switch actually costs and gains. No spin, just clarity.",
        sessionTopic: "Career Growth",
        date: "June 4, 2024",
      },
      {
        reviewerName: "Renee P.",
        reviewerRole: "New engineering manager",
        quote:
          "She walked me through her actual 1:1 framework. I started using it the next week and my team noticed immediately.",
        sessionTopic: "Team Scaling",
        date: "May 21, 2024",
      },
    ],
  },
  {
    id: "alex-rivera",
    name: "Alex Rivera",
    role: "Senior iOS Engineer",
    company: "Cash App",
    imageUrl:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=500&fit=crop&crop=faces&q=80",
    category: "Software Engineering",
    trackId: "software-engineering",
    tags: ["iOS", "Swift", "Mobile Arch", "Career Switching"],
    available: true,
    verified: true,
    rating: 4.9,
    reviewCount: 24,
    sessionsGiven: 29,
    bio: "Mobile architecture, Swift, and portfolio walkthroughs for junior developers seeking their first iOS role.",
    nextOpening: "Tuesday, 11:00 AM PST",
    sessionFormat: "1:1 Video (30m)",
    durationMinutes: 30,
    matchScore: 82,
    location: "Miami, USA (UTC-5)",
    language: "English, Spanish",
    attendanceRate: 100,
    responseTime: "Usually responds in 5 hours",
    philosophy:
      "Your first iOS role doesn't need a flashy app — it needs one app done with real architectural discipline. I help people build that one app.",
    aboutParagraphs: [
      "Hi, I'm Alex. I work on the core payments experience at Cash App, focused on iOS architecture and performance.",
      "I switched into iOS from a customer support role with no CS background. I mentor junior mobile developers on turning a single portfolio app into an interview-ready showcase.",
    ],
    skillGroups: [
      {
        groupLabel: "Mobile Engineering",
        skills: ["iOS", "Swift", "Mobile Arch"],
      },
      {
        groupLabel: "Career Development",
        skills: ["Career Switching", "Portfolio Review"],
      },
    ],
    experience: [
      {
        title: "Senior iOS Engineer",
        org: "Cash App",
        location: "Miami, FL",
        period: "2021 — Present",
        description: "Owns core payments UI architecture across the iOS app.",
      },
      {
        title: "iOS Engineer",
        org: "Postmates",
        location: "Miami, FL",
        period: "2019 — 2021",
        description: "Shipped the courier-side navigation and delivery tracking experience.",
      },
    ],
    reviews: [
      {
        reviewerName: "Nina F.",
        reviewerRole: "Self-taught iOS developer",
        quote:
          "Alex reviewed my portfolio app's architecture line by line and gave me a clear list of what to fix before applying.",
        sessionTopic: "Mobile Arch",
        date: "July 3, 2024",
      },
      {
        reviewerName: "Owen M.",
        reviewerRole: "Career switcher",
        quote:
          "He's incredibly patient explaining Swift concurrency. First mentor who made it actually click for me.",
        sessionTopic: "Swift",
        date: "June 18, 2024",
      },
    ],
  },
  {
    id: "daniel-osei",
    name: "Daniel Osei",
    role: "Technical Writer",
    company: "Google",
    imageUrl:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=500&fit=crop&crop=faces&q=80",
    category: "Technical Writing",
    trackId: "other",
    tags: ["API Docs", "Style Guides", "Editing"],
    available: true,
    verified: true,
    rating: 4.9,
    reviewCount: 18,
    sessionsGiven: 21,
    bio: "Helping engineers turn dense technical work into documentation that actually gets read — API references, style guides, and editing passes.",
    nextOpening: "Monday, 9:00 AM PST",
    sessionFormat: "Async Portfolio & Code Review",
    durationMinutes: 45,
    matchScore: 70,
    location: "Toronto, Canada (UTC-5)",
    language: "English",
    attendanceRate: 100,
    responseTime: "Usually responds in 1 day",
    philosophy:
      "Good documentation is a product surface, not an afterthought. I help engineers write docs their users actually finish reading.",
    aboutParagraphs: [
      "Hi, I'm Daniel. I write and edit developer-facing documentation at Google, working across several public API surfaces.",
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
        org: "Google",
        location: "Toronto, Canada",
        period: "2019 — Present",
        description: "Writes and maintains developer documentation for several public API surfaces.",
      },
      {
        title: "Content Strategist",
        org: "Shopify",
        location: "Ottawa, Canada",
        period: "2016 — 2019",
        description: "Led documentation strategy for Shopify's merchant-facing developer platform.",
      },
    ],
    reviews: [
      {
        reviewerName: "Leah S.",
        reviewerRole: "Backend engineer",
        quote:
          "Daniel edited my API reference docs and the improvement in clarity was night and day. He explains the 'why' behind every edit.",
        sessionTopic: "API Docs",
        date: "May 9, 2024",
      },
      {
        reviewerName: "Ravi P.",
        reviewerRole: "Junior engineer",
        quote:
          "Helped me write a promo packet that didn't read like a diary. Concrete, structural feedback.",
        sessionTopic: "Editing",
        date: "April 22, 2024",
      },
    ],
  },
];
