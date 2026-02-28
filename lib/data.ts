export interface Experience {
  company: string;
  role: string;
  period: string;
  logo: string;
  bullets: string[];
}

export interface Project {
  name: string;
  description: string;
  longDescription: string;
  link: string;
  tech: string[];
  year: string;
  images: string[];
}

export interface SkillCategory {
  name: string;
  skills: { name: string; level: number; years: string; projects: number }[];
}

export interface Achievement {
  label: string;
  value: string;
  numericValue: number;
  suffix: string;
  description: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export const personalInfo = {
  name: "Stephen Addo",
  tagline: "Automation Software Engineer @ BDO UK",
  subtitle: "C# \u00b7 Java \u00b7 RPA \u00b7 UiPath \u00b7 .NET",
  email: "a.stephenyeboah04@gmail.com",
  about: [
    "A recent Computer Science graduate from Lancaster University, I now work as an Automation Software Engineer at BDO, designing RPA and workflow automation solutions that streamline enterprise processes.",
    "I also continue as a Software Engineer at FDM Group, delivering scalable software solutions for global clients. My journey spans from low-level embedded systems programming to quantum computing research.",
    "I\u2019ve solved 63 algorithmic challenges on LeetCode, refined large-language models at Outlier AI, and built projects ranging from 3D physics simulations to genetic algorithm pathfinders.",
    "I\u2019m driven by the intersection of artificial intelligence and quantum computing \u2014 pushing the boundaries of what software can achieve.",
  ],
  pullQuote:
    "From embedded systems to quantum computing \u2014 engineering the future, one abstraction at a time.",
};

export const experiences: Experience[] = [
  {
    company: "BDO",
    role: "Automation Software Engineer",
    period: "Feb 2026 \u2013 Present",
    logo: "/images/BDO_ (1).png",
    bullets: [
      "Designing RPA and workflow automation solutions for enterprise processes",
      "Building scalable automation tools using C#, .NET, and UiPath",
      "Integrating automation pipelines with existing business systems",
    ],
  },
  {
    company: "FDM Group",
    role: "Software Engineer",
    period: "Sep 2025 \u2013 Present",
    logo: "/images/FDM Group Logo.png",
    bullets: [
      "Delivering enterprise software solutions using Java, Python, SQL, and cloud platforms",
      "Working in Agile teams to ship features across multiple client projects",
      "Driving stakeholder communication and technical documentation",
    ],
  },
  {
    company: "Labelbox",
    role: "Software Engineer",
    period: "Jul 2024 \u2013 Aug 2025",
    logo: "/images/Labelbox_Logo.png",
    bullets: [
      "Built systems powering AI model development and data-labelling tools",
      "Achieved 50% load time reduction through performance optimization",
      "Served 10,000+ daily users across the platform",
    ],
  },
  {
    company: "Outlier AI",
    role: "AI Trainer",
    period: "Jul 2024 \u2013 Mar 2025",
    logo: "/images/outlier_logo.png",
    bullets: [
      "Refined LLM datasets to improve model accuracy and coherence",
      "Curated large-scale datasets for training next-generation language models",
    ],
  },
  {
    company: "Lancaster University",
    role: "BSc Computer Science Graduate",
    period: "Oct 2022 \u2013 Jun 2025",
    logo: "/images/Lancaster_uni.png",
    bullets: [
      "Graduated with First-Class Honours",
      "Built web applications and performance-optimised systems",
      "Researched quantum computing algorithms for dissertation",
    ],
  },
  {
    company: "Specsavers",
    role: "Optical Assistant",
    period: "Sep 2023 \u2013 May 2025",
    logo: "/images/specsavers.png",
    bullets: [
      "Delivered exceptional customer service in a fast-paced retail environment",
      "Supported pre-examination processes and patient care",
    ],
  },
  {
    company: "Boots Opticians",
    role: "Optical Consultant",
    period: "Aug 2022 \u2013 Aug 2024",
    logo: "/images/Boots_Opticians.png",
    bullets: [
      "Provided patient advice and eyewear consultation",
      "Conducted pre-examination tests and clinical support",
    ],
  },
];

export const projects: Project[] = [
  {
    name: "Quantum Computing for Combinatorial Optimisation",
    description:
      "Dissertation exploring QAOA & Grover\u2019s algorithm for combinatorial optimization problems via Qiskit and Cirq.",
    longDescription:
      "This third-year dissertation investigates how quantum algorithms can tackle NP-hard combinatorial optimization problems more efficiently than classical approaches. The project implements the Quantum Approximate Optimization Algorithm (QAOA) and Grover\u2019s search algorithm using both IBM\u2019s Qiskit and Google\u2019s Cirq frameworks. Benchmarks compare quantum solutions against classical brute-force and heuristic methods across problem sizes, measuring solution quality, circuit depth, and execution time on simulators. The research demonstrates promising quantum speedup for Max-Cut and graph colouring problems while identifying current hardware limitations in the NISQ era.",
    link: "https://github.com/Steve-IX/Exploring-Quantum-Algorithms-for-Combinatorial-Optimization",
    tech: ["Python", "Quantum Computing", "Qiskit", "Cirq"],
    year: "2024",
    images: [
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
      "https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=800&q=80",
      "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&q=80",
    ],
  },
  {
    name: "3D Physics Simulation",
    description:
      "C++ / Python VPython simulation modelling gravity, collisions, and vector dynamics in real time.",
    longDescription:
      "A real-time 3D physics engine built from scratch in C++ with a Python/VPython visual front-end. The simulation accurately models Newtonian mechanics including gravitational attraction between n-bodies, elastic and inelastic collisions with coefficient of restitution, and vector force decomposition. Objects are rendered as 3D spheres with trails showing orbital paths, and users can interactively adjust mass, velocity, and gravitational constants. The project demonstrates numerical integration techniques (Euler and Verlet methods) and spatial partitioning for efficient collision detection at scale.",
    link: "https://github.com/Steve-IX/Simulations",
    tech: ["C++", "Python", "VPython", "Physics"],
    year: "2022",
    images: [
      "https://images.unsplash.com/photo-1580894908361-967195033215?w=800&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80",
    ],
  },
  {
    name: "BBC micro:bit Timers & Serial Demo",
    description:
      "Bare-metal implementation exploring timers and software serial communication on the BBC micro:bit (nRF52).",
    longDescription:
      "A bare-metal systems programming project that dives deep into the nRF52833 microcontroller powering the BBC micro:bit v2. Without any abstraction layers or RTOS, the project implements hardware timer configuration using TIMER peripherals for precise microsecond-level timing, bit-banged software serial (UART) communication at configurable baud rates, and real-time LED matrix multiplexing. The codebase demonstrates register-level programming, interrupt vector table configuration, and the intricacies of real-time embedded systems where every clock cycle matters.",
    link: "https://github.com/Steve-IX/BBC-micro-bit-Timers-Software-Serial-Demo",
    tech: ["C++", "Embedded Systems", "nRF52"],
    year: "2023",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80",
      "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&q=80",
    ],
  },
  {
    name: "HOG & Harris Corner Detection",
    description:
      "MATLAB implementation of Histogram of Oriented Gradients and Harris Corner Detection algorithms from scratch.",
    longDescription:
      "A from-scratch MATLAB implementation of two foundational computer vision algorithms. The Histogram of Oriented Gradients (HOG) descriptor computes gradient magnitudes and orientations across image cells, building robust feature vectors used in object detection pipelines. The Harris Corner Detector identifies interest points by analysing the eigenvalues of the structure tensor, enabling reliable corner and edge detection. Both algorithms are implemented without relying on built-in toolbox functions, with visualisations showing gradient fields, HOG cell histograms, and detected corner overlays on test images.",
    link: "https://github.com/Steve-IX/HOG-Harris-Corner-Detection",
    tech: ["MATLAB", "Computer Vision", "Feature Detection"],
    year: "2023",
    images: [
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&q=80",
    ],
  },
  {
    name: "Interrupts & Displays",
    description:
      "C++ implementation transforming the BBC micro:bit into a dual-display, real-time data logger using hardware interrupts.",
    longDescription:
      "This embedded systems project transforms the BBC micro:bit into a sophisticated dual-display real-time data logger. Using hardware interrupts (GPIO and TIMER IRQs), the system captures sensor readings with precise timing guarantees while simultaneously driving two output displays: the onboard 5\u00d75 LED matrix and an external OLED screen via I2C. The interrupt service routines are carefully designed to minimise latency and avoid priority inversion. The project showcases advanced concepts including interrupt nesting, debouncing, DMA-assisted display updates, and real-time scheduling on resource-constrained hardware.",
    link: "https://github.com/Steve-IX/Interrupts-and-displays",
    tech: ["C++", "Embedded Systems", "Interrupts"],
    year: "2023",
    images: [
      "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=800&q=80",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
      "https://images.unsplash.com/photo-1597589827317-4c6d6e0a90bd?w=800&q=80",
    ],
  },
  {
    name: "Genetic Algorithm Pathfinder",
    description:
      "GA-PathPlanner: MATLAB project finding collision-free paths using genetic algorithms and evolutionary strategies.",
    longDescription:
      "GA-PathPlanner applies evolutionary computation to the robot path planning problem. The system encodes candidate paths as chromosomes (sequences of waypoints) and evolves a population through selection, crossover, and mutation operators to discover collision-free routes through obstacle-rich 2D environments. Fitness evaluation considers path length, smoothness, obstacle clearance, and feasibility. The project implements tournament selection, single-point and uniform crossover, Gaussian mutation, and elitism preservation. Visualisations animate the evolutionary process generation by generation, showing how the population converges from random paths to near-optimal solutions.",
    link: "https://github.com/Steve-IX/Genetic-Algorithms",
    tech: ["MATLAB", "Genetic Algorithms", "Path Planning"],
    year: "2023",
    images: [
      "https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=800&q=80",
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80",
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
    ],
  },
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    skills: [
      { name: "JavaScript", level: 95, years: "4+", projects: 25 },
      { name: "Python", level: 90, years: "3+", projects: 18 },
      { name: "C++", level: 85, years: "3+", projects: 12 },
      { name: "Java", level: 83, years: "2+", projects: 13 },
      { name: "TypeScript", level: 88, years: "2+", projects: 15 },
      { name: "C#", level: 80, years: "1+", projects: 8 },
      { name: "SQL", level: 78, years: "2+", projects: 10 },
      { name: "MATLAB", level: 75, years: "2+", projects: 6 },
    ],
  },
  {
    name: "Frameworks & Libraries",
    skills: [
      { name: "React", level: 92, years: "3+", projects: 20 },
      { name: "Next.js", level: 88, years: "2+", projects: 12 },
      { name: "Node.js", level: 85, years: "3+", projects: 16 },
      { name: "Express", level: 82, years: "2+", projects: 14 },
      { name: ".NET", level: 78, years: "1+", projects: 6 },
      { name: "Tailwind CSS", level: 90, years: "2+", projects: 15 },
    ],
  },
  {
    name: "Tools & Technologies",
    skills: [
      { name: "Git", level: 90, years: "4+", projects: 30 },
      { name: "Docker", level: 75, years: "1+", projects: 8 },
      { name: "AWS", level: 70, years: "1+", projects: 6 },
      { name: "UiPath", level: 80, years: "1+", projects: 5 },
      { name: "MongoDB", level: 80, years: "2+", projects: 10 },
      { name: "PostgreSQL", level: 76, years: "2+", projects: 8 },
    ],
  },
];

export const achievements: Achievement[] = [
  {
    label: "LeetCode Problems",
    value: "63",
    numericValue: 63,
    suffix: "",
    description: "Algorithmic challenges solved",
  },
  {
    label: "Daily Users Served",
    value: "10,000+",
    numericValue: 10000,
    suffix: "+",
    description: "Through Labelbox systems",
  },
  {
    label: "Performance Boost",
    value: "50%",
    numericValue: 50,
    suffix: "%",
    description: "Load time optimization",
  },
  {
    label: "Degree Classification",
    value: "1st",
    numericValue: 1,
    suffix: "st",
    description: "First-Class Honours",
  },
  {
    label: "Years Experience",
    value: "3+",
    numericValue: 3,
    suffix: "+",
    description: "Professional development",
  },
  {
    label: "Projects Completed",
    value: "15+",
    numericValue: 15,
    suffix: "+",
    description: "Personal & professional",
  },
];

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/Steve-IX",
    icon: "github",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/stephen-addo-568b43215",
    icon: "linkedin",
  },
  {
    name: "LeetCode",
    url: "https://leetcode.com/u/SteveIX/",
    icon: "code",
  },
  {
    name: "Email",
    url: "mailto:a.stephenyeboah04@gmail.com",
    icon: "mail",
  },
];

export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Achievements", href: "#achievements" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Dissertation", href: "#dissertation" },
  { label: "Skills", href: "#skills" },
  { label: "Code Lab", href: "#codelab" },
  { label: "Contact", href: "#contact" },
];
