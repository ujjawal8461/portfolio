"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
    SiC, SiCplusplus, SiJavascript, SiTypescript,
    SiHtml5, SiCss3, SiMongodb, SiReact, SiExpress, SiNodedotjs,
    SiNextdotjs, SiTailwindcss, SiBootstrap, SiSass,
    SiGraphql, SiRedux, SiMysql, SiPostgresql, SiPrisma,
    SiVscodium, SiPostman, SiGit, SiGithub, SiBitbucket,
    SiJira, SiAndroidstudio, SiFigma, SiCanva, SiVercel,
    SiRedis, SiSwagger, SiJest, SiDocker
} from "react-icons/si";
import { IconType } from "react-icons";

type Category = "all" | "language" | "webdev" | "frontend" | "backend" | "statemanagement" | "database" | "tools";

interface SkillItem {
    id: number;
    name: string;
    Icon: IconType;
    categories: Category[];
    x: number; // % from left
    y: number; // % from top
    size: number; // icon size in px
    rotate: number; // slight rotation
}

const rawSkills: Omit<SkillItem, "x" | "y" | "size" | "rotate">[] = [
    { id: 1, name: "C", Icon: SiC, categories: ["language"] },
    { id: 2, name: "C++", Icon: SiCplusplus, categories: ["language"] },
    { id: 3, name: "JavaScript", Icon: SiJavascript, categories: ["language", "webdev", "frontend"] },
    { id: 4, name: "TypeScript", Icon: SiTypescript, categories: ["language", "frontend"] },
    { id: 5, name: "HTML", Icon: SiHtml5, categories: ["webdev", "frontend"] },
    { id: 6, name: "CSS", Icon: SiCss3, categories: ["webdev", "frontend"] },
    { id: 7, name: "MongoDB", Icon: SiMongodb, categories: ["webdev", "database"] },
    { id: 8, name: "React", Icon: SiReact, categories: ["webdev", "frontend"] },
    { id: 9, name: "Express", Icon: SiExpress, categories: ["webdev", "backend"] },
    { id: 10, name: "Node.js", Icon: SiNodedotjs, categories: ["webdev", "backend"] },
    { id: 11, name: "Next.js", Icon: SiNextdotjs, categories: ["webdev", "frontend"] },
    { id: 12, name: "Tailwind", Icon: SiTailwindcss, categories: ["frontend"] },
    { id: 13, name: "Bootstrap", Icon: SiBootstrap, categories: ["frontend"] },
    { id: 14, name: "Sass", Icon: SiSass, categories: ["frontend"] },
    { id: 15, name: "GraphQL", Icon: SiGraphql, categories: ["backend"] },
    { id: 16, name: "Redux", Icon: SiRedux, categories: ["statemanagement"] },
    { id: 17, name: "MySQL", Icon: SiMysql, categories: ["database"] },
    { id: 18, name: "PostgreSQL", Icon: SiPostgresql, categories: ["database"] },
    { id: 19, name: "Prisma", Icon: SiPrisma, categories: ["database"] },
    { id: 20, name: "VS Code", Icon: SiVscodium, categories: ["tools"] },
    { id: 21, name: "Postman", Icon: SiPostman, categories: ["tools"] },
    { id: 22, name: "Git", Icon: SiGit, categories: ["tools"] },
    { id: 23, name: "GitHub", Icon: SiGithub, categories: ["tools"] },
    { id: 24, name: "Bitbucket", Icon: SiBitbucket, categories: ["tools"] },
    { id: 25, name: "Jira", Icon: SiJira, categories: ["tools"] },
    { id: 26, name: "Android Studio", Icon: SiAndroidstudio, categories: ["tools"] },
    { id: 27, name: "Figma", Icon: SiFigma, categories: ["tools"] },
    { id: 28, name: "Canva", Icon: SiCanva, categories: ["tools"] },
    { id: 29, name: "Vercel", Icon: SiVercel, categories: ["tools"] },
    { id: 30, name: "Redis", Icon: SiRedis, categories: ["backend"] },
    { id: 31, name: "Swagger", Icon: SiSwagger, categories: ["backend"] },
    { id: 32, name: "Jest", Icon: SiJest, categories: ["backend"] },
    { id: 33, name: "Docker", Icon: SiDocker, categories: ["tools"] },
    { id: 34, name: "React Hook Form", Icon: SiReact, categories: ["frontend"] },
    { id: 35, name: "Context API", Icon: SiReact, categories: ["statemanagement"] },
    { id: 36, name: "Redux Toolkit", Icon: SiRedux, categories: ["statemanagement"] },
    { id: 37, name: "Knex", Icon: SiNodedotjs, categories: ["database"] },
    { id: 38, name: "pgAdmin", Icon: SiPostgresql, categories: ["tools"] },
];

// Deterministic pseudo-random layout — no Math.random() on render
function seededLayout(skills: typeof rawSkills): SkillItem[] {
    // Simple LCG seeded random for deterministic placement
    let seed = 42;
    const rand = () => {
        seed = (seed * 1664525 + 1013904223) & 0xffffffff;
        return (seed >>> 0) / 0xffffffff;
    };

    // Define zones to spread icons across the full canvas
    // Avoid center area (where heading/categories sit)
    const zones = [
        { xMin: 2, xMax: 18, yMin: 5, yMax: 85 },    // far left column
        { xMin: 18, xMax: 35, yMin: 3, yMax: 40 },   // upper-mid-left
        { xMin: 18, xMax: 35, yMin: 58, yMax: 95 },  // lower-mid-left
        { xMin: 65, xMax: 82, yMin: 3, yMax: 40 },   // upper-mid-right
        { xMin: 65, xMax: 82, yMin: 58, yMax: 95 },  // lower-mid-right
        { xMin: 82, xMax: 98, yMin: 5, yMax: 85 },   // far right column
        { xMin: 35, xMax: 50, yMin: 3, yMax: 20 },   // top-center-left
        { xMin: 50, xMax: 65, yMin: 3, yMax: 20 },   // top-center-right
        { xMin: 35, xMax: 50, yMin: 78, yMax: 95 },  // bottom-center-left
        { xMin: 50, xMax: 65, yMin: 78, yMax: 95 },  // bottom-center-right
    ];

    return skills.map((skill, i) => {
        const zone = zones[i % zones.length];
        const x = zone.xMin + rand() * (zone.xMax - zone.xMin);
        const y = zone.yMin + rand() * (zone.yMax - zone.yMin);
        const size = 28 + Math.floor(rand() * 22); // 28–50px
        const rotate = (rand() - 0.5) * 20; // -10 to +10 deg
        return { ...skill, x, y, size, rotate };
    });
}

const skills: SkillItem[] = seededLayout(rawSkills);

const categories: { key: Category; label: string }[] = [
    { key: "language", label: "Language" },
    { key: "webdev", label: "Web Dev" },
    { key: "frontend", label: "Frontend" },
    { key: "backend", label: "Backend" },
    { key: "statemanagement", label: "State Mgmt" },
    { key: "database", label: "Database" },
    { key: "tools", label: "Tools" },
];

export default function SkillsSection() {
    const [activeCategory, setActiveCategory] = useState<Category>("all");
    const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);
    const [tooltip, setTooltip] = useState<{ id: number; x: number; y: number } | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const handleScroll = () => {
            const rect = section.getBoundingClientRect();
            const wh = window.innerHeight;
            if (rect.top <= 0 && rect.bottom > wh) {
                const p = Math.max(0, Math.min(1, -rect.top / (rect.height - wh)));
                setScrollProgress(p);
            } else if (rect.top > 0) setScrollProgress(0);
            else setScrollProgress(1);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isSkillLit = useCallback((skill: SkillItem) => {
        if (hoveredSkill === skill.id) return true;
        if (activeCategory === "all") return false;
        return skill.categories.includes(activeCategory);
    }, [activeCategory, hoveredSkill]);

    const handleMouseEnter = (skill: SkillItem, e: React.MouseEvent) => {
        setHoveredSkill(skill.id);
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const parentRect = sectionRef.current?.getBoundingClientRect();
        if (parentRect) {
            setTooltip({
                id: skill.id,
                x: rect.left - parentRect.left + rect.width / 2,
                y: rect.top - parentRect.top - 36,
            });
        }
    };

    const handleMouseLeave = () => {
        setHoveredSkill(null);
        setTooltip(null);
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-black"
            style={{ minHeight: "100vh" }}
        >
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">

                {/* Heading */}
                <h2
                    className="text-center text-5xl md:text-7xl font-bold tracking-[0.3em] uppercase mb-6 z-10 relative"
                    style={{
                        color: scrollProgress > 0.02 ? "#FFD700" : "#888",
                        textShadow: scrollProgress > 0.02
                            ? "0 0 60px rgba(255,215,0,0.6), 0 0 100px rgba(255,215,0,0.3)"
                            : "none",
                        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        fontFamily: "system-ui, -apple-system, sans-serif"
                    }}
                >
                    SKILLS
                </h2>

                {/* Category pills */}
                <div className="flex flex-wrap justify-center gap-2 mb-4 px-4 z-10 relative">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.key;
                        return (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(isActive ? "all" : cat.key)}
                                onMouseEnter={() => !isActive && setActiveCategory(cat.key)}
                                onMouseLeave={() => !isActive && setActiveCategory("all")}
                                className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 border cursor-pointer"
                                style={{
                                    background: isActive
                                        ? "rgba(255,215,0,0.18)"
                                        : "rgba(255,255,255,0.03)",
                                    borderColor: isActive
                                        ? "rgba(255,215,0,0.7)"
                                        : "rgba(255,255,255,0.1)",
                                    color: isActive ? "#FFD700" : "#666",
                                    boxShadow: isActive
                                        ? "0 0 20px rgba(255,215,0,0.3)"
                                        : "none",
                                }}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Icon collage canvas */}
                <div
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 1 }}
                >
                    {skills.map((skill) => {
                        const lit = isSkillLit(skill);
                        const Icon = skill.Icon;

                        return (
                            <div
                                key={skill.id}
                                className="absolute pointer-events-auto cursor-pointer"
                                style={{
                                    left: `${skill.x}%`,
                                    top: `${skill.y}%`,
                                    transform: `translate(-50%, -50%) rotate(${skill.rotate}deg)`,
                                    transition: "filter 0.3s ease, opacity 0.3s ease, transform 0.2s ease",
                                    opacity: lit ? 1 : 0.28,
                                    filter: lit
                                        ? `drop-shadow(0 0 8px rgba(255,215,0,0.9)) drop-shadow(0 0 20px rgba(255,215,0,0.5))`
                                        : "grayscale(1) brightness(0.5)",
                                    zIndex: lit ? 20 : 5,
                                    willChange: "filter, opacity",
                                }}
                                onMouseEnter={(e) => handleMouseEnter(skill, e)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Icon
                                    size={skill.size}
                                    color={lit ? "#FFD700" : "#888"}
                                    style={{ transition: "color 0.3s ease", display: "block" }}
                                />
                            </div>
                        );
                    })}

                    {/* Tooltip */}
                    {tooltip && hoveredSkill !== null && (
                        <div
                            className="absolute pointer-events-none z-30 px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase whitespace-nowrap"
                            style={{
                                left: `${tooltip.x}px`,
                                top: `${tooltip.y}px`,
                                transform: "translateX(-50%)",
                                background: "rgba(0,0,0,0.85)",
                                border: "1px solid rgba(255,215,0,0.5)",
                                color: "#FFD700",
                                boxShadow: "0 0 16px rgba(255,215,0,0.3)",
                                fontFamily: "system-ui, -apple-system, sans-serif",
                            }}
                        >
                            {skills.find((s) => s.id === hoveredSkill)?.name}
                        </div>
                    )}
                </div>

                {/* Subtle ambient glow when category active */}
                {activeCategory !== "all" && (
                    <div
                        className="absolute inset-0 pointer-events-none z-0"
                        style={{
                            background:
                                "radial-gradient(ellipse at center, rgba(255,215,0,0.03) 0%, transparent 70%)",
                        }}
                    />
                )}
            </div>
        </section>
    );
}
