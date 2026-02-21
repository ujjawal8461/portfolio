"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
    SiC, SiCplusplus, SiJavascript, SiTypescript,
    SiHtml5, SiCss3, SiMongodb, SiReact, SiExpress, SiNodedotjs,
    SiNextdotjs, SiTailwindcss, SiBootstrap, SiSass,
    SiGraphql, SiRedux, SiMysql, SiPostgresql, SiPrisma,
    SiPostman, SiGit, SiGithub, SiBitbucket,
    SiJira, SiAndroidstudio, SiFigma, SiCanva, SiVercel,
    SiRedis, SiSwagger, SiJest, SiDocker, SiZod, SiJsonwebtokens,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { IconType } from "react-icons";

type Category = "all" | "language" | "webdev" | "frontend" | "backend" | "statemanagement" | "database" | "tools";

interface SkillItem {
    id: number;
    name: string;
    Icon?: IconType;
    textIcon?: string;
    categories: Category[];
    x: number;
    y: number;
    size: number;
    rotate: number;
}

const TEXT_SKILLS: Pick<SkillItem, "id" | "name" | "textIcon" | "categories">[] = [
    { id: 101, name: "REST APIs", textIcon: "REST", categories: ["backend", "webdev"] },
    { id: 102, name: "CRON Jobs", textIcon: "CRON", categories: ["backend"] },
    { id: 103, name: "Yup", textIcon: "Yup", categories: ["backend"] },
    { id: 104, name: "Context API", textIcon: "CTX", categories: ["statemanagement"] },
    { id: 105, name: "Knex", textIcon: "Knex", categories: ["database"] },
];

const ICON_SKILLS: Pick<SkillItem, "id" | "name" | "Icon" | "categories">[] = [
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
    { id: 17, name: "Redux Toolkit", Icon: SiRedux, categories: ["statemanagement"] },
    { id: 18, name: "MySQL", Icon: SiMysql, categories: ["database"] },
    { id: 19, name: "PostgreSQL", Icon: SiPostgresql, categories: ["database"] },
    { id: 20, name: "Prisma", Icon: SiPrisma, categories: ["database"] },
    { id: 21, name: "VS Code", Icon: VscVscode, categories: ["tools"] },
    { id: 22, name: "Postman", Icon: SiPostman, categories: ["tools"] },
    { id: 23, name: "Git", Icon: SiGit, categories: ["tools"] },
    { id: 24, name: "GitHub", Icon: SiGithub, categories: ["tools"] },
    { id: 25, name: "Bitbucket", Icon: SiBitbucket, categories: ["tools"] },
    { id: 26, name: "Jira", Icon: SiJira, categories: ["tools"] },
    { id: 27, name: "Android Studio", Icon: SiAndroidstudio, categories: ["tools"] },
    { id: 28, name: "Figma", Icon: SiFigma, categories: ["tools"] },
    { id: 29, name: "Canva", Icon: SiCanva, categories: ["tools"] },
    { id: 30, name: "Vercel", Icon: SiVercel, categories: ["tools"] },
    { id: 31, name: "Redis", Icon: SiRedis, categories: ["backend"] },
    { id: 32, name: "Swagger", Icon: SiSwagger, categories: ["backend"] },
    { id: 33, name: "Jest", Icon: SiJest, categories: ["backend"] },
    // { id: 34, name: "Docker", Icon: SiDocker, categories: ["tools"] },
    { id: 35, name: "Zod", Icon: SiZod, categories: ["backend"] },
    { id: 36, name: "JWT", Icon: SiJsonwebtokens, categories: ["backend"] },
    { id: 37, name: "React Hook Form", Icon: SiReact, categories: ["frontend"] },
    { id: 38, name: "pgAdmin", Icon: SiPostgresql, categories: ["tools"] },
];

// ─── Overlap-free grid layout ────────────────────────────────────────────────
function buildLayout(): SkillItem[] {
    let seed = 137;
    const rand = () => {
        seed = (seed * 1664525 + 1013904223) & 0xffffffff;
        return (seed >>> 0) / 0xffffffff;
    };

    // 14 cols × 10 rows grid in 100×100 virtual space
    // Center band (x:28–72, y:24–74) is reserved for heading + categories
    const COLS = 14;
    const ROWS = 10;
    const cells: { x: number; y: number }[] = [];

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const x = 3 + (col / (COLS - 1)) * 94;
            const y = 4 + (row / (ROWS - 1)) * 92;
            if (x > 28 && x < 72 && y > 22 && y < 76) continue;
            cells.push({ x, y });
        }
    }

    // Shuffle cells
    for (let i = cells.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [cells[i], cells[j]] = [cells[j], cells[i]];
    }

    const allRaw = [
        ...ICON_SKILLS.map((s) => ({ ...s, textIcon: undefined })),
        ...TEXT_SKILLS.map((s) => ({ ...s, Icon: undefined })),
    ];

    return allRaw.map((skill, i) => {
        const cell = cells[i % cells.length];
        // Small jitter so layout looks organic, not grid-perfect
        const jitterX = (rand() - 0.5) * 3;
        const jitterY = (rand() - 0.5) * 3;
        const size = 28 + Math.floor(rand() * 18); // 28–46px
        const rotate = (rand() - 0.5) * 16;

        return {
            ...skill,
            x: Math.max(2, Math.min(97, cell.x + jitterX)),
            y: Math.max(2, Math.min(97, cell.y + jitterY)),
            size,
            rotate,
        } as SkillItem;
    });
}

const skills: SkillItem[] = buildLayout();

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
    const [lockedCategory, setLockedCategory] = useState<Category>("all");
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
                setScrollProgress(Math.max(0, Math.min(1, -rect.top / (rect.height - wh))));
            } else if (rect.top > 0) setScrollProgress(0);
            else setScrollProgress(1);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const effectiveCategory = lockedCategory !== "all" ? lockedCategory : activeCategory;

    const isSkillLit = useCallback((skill: SkillItem) => {
        if (hoveredSkill === skill.id) return true;
        if (effectiveCategory === "all") return false;
        return skill.categories.includes(effectiveCategory);
    }, [effectiveCategory, hoveredSkill]);

    const showName = useCallback((skill: SkillItem) => {
        if (hoveredSkill === skill.id) return true;
        if (effectiveCategory !== "all" && skill.categories.includes(effectiveCategory)) return true;
        return false;
    }, [effectiveCategory, hoveredSkill]);

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

    const handleCategoryClick = (key: Category) => {
        if (lockedCategory === key) {
            setLockedCategory("all");
            setActiveCategory("all");
        } else {
            setLockedCategory(key);
            setActiveCategory(key);
        }
    };

    const handleCategoryEnter = (key: Category) => {
        if (lockedCategory === "all") setActiveCategory(key);
    };

    const handleCategoryLeave = () => {
        if (lockedCategory === "all") setActiveCategory("all");
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
                    className="text-center text-5xl md:text-7xl font-bold tracking-[0.3em] uppercase mb-5 z-10 relative"
                    style={{
                        color: scrollProgress > 0.02 ? "#FFD700" : "#888",
                        textShadow: scrollProgress > 0.02
                            ? "0 0 60px rgba(255,215,0,0.6), 0 0 100px rgba(255,215,0,0.3)"
                            : "none",
                        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                >
                    SKILLS
                </h2>

                {/* Category pills */}
                <div className="flex flex-wrap justify-center gap-2 px-4 z-10 relative">
                    {categories.map((cat) => {
                        const isLocked = lockedCategory === cat.key;
                        const isHighlighted = effectiveCategory === cat.key;

                        return (
                            <button
                                key={cat.key}
                                onClick={() => handleCategoryClick(cat.key)}
                                onMouseEnter={() => handleCategoryEnter(cat.key)}
                                onMouseLeave={handleCategoryLeave}
                                className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 border cursor-pointer"
                                style={{
                                    background: isHighlighted ? "rgba(255,215,0,0.18)" : "rgba(255,255,255,0.03)",
                                    borderColor: isHighlighted ? "rgba(255,215,0,0.7)" : "rgba(255,255,255,0.1)",
                                    color: isHighlighted ? "#FFD700" : "#555",
                                    boxShadow: isHighlighted ? "0 0 20px rgba(255,215,0,0.3)" : "none",
                                    outline: isLocked ? "2px solid rgba(255,215,0,0.4)" : "none",
                                    outlineOffset: "2px",
                                }}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Hint */}
                <p
                    className="z-10 relative mt-2 text-center"
                    style={{
                        fontSize: "9px",
                        color: "#3a3a3a",
                        letterSpacing: "0.12em",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                >
                    HOVER TO PREVIEW · CLICK TO LOCK
                </p>

                {/* Icon collage */}
                <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                    {skills.map((skill) => {
                        const lit = isSkillLit(skill);
                        const named = showName(skill);
                        const Icon = skill.Icon;

                        return (
                            <div
                                key={skill.id}
                                className="absolute pointer-events-auto cursor-pointer flex flex-col items-center"
                                style={{
                                    left: `${skill.x}%`,
                                    top: `${skill.y}%`,
                                    transform: `translate(-50%, -50%) rotate(${skill.rotate}deg)`,
                                    transition: "filter 0.3s ease, opacity 0.3s ease",
                                    opacity: lit ? 1 : 0.28,
                                    filter: lit
                                        ? "drop-shadow(0 0 8px rgba(255,215,0,0.9)) drop-shadow(0 0 20px rgba(255,215,0,0.5))"
                                        : "grayscale(1) brightness(0.45)",
                                    zIndex: lit ? 20 : 5,
                                    willChange: "filter, opacity",
                                    gap: "3px",
                                }}
                                onMouseEnter={(e) => handleMouseEnter(skill, e)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {Icon ? (
                                    <Icon
                                        size={skill.size}
                                        color={lit ? "#FFD700" : "#888"}
                                        style={{ transition: "color 0.3s ease", display: "block" }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: `${skill.size + 10}px`,
                                            height: `${skill.size}px`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border: `2px solid ${lit ? "rgba(255,215,0,0.8)" : "rgba(136,136,136,0.4)"}`,
                                            borderRadius: "5px",
                                            fontSize: `${Math.max(9, skill.size * 0.36)}px`,
                                            fontWeight: 800,
                                            fontFamily: "system-ui, -apple-system, sans-serif",
                                            color: lit ? "#FFD700" : "#777",
                                            letterSpacing: "0.03em",
                                            transition: "all 0.3s ease",
                                            background: lit ? "rgba(255,215,0,0.06)" : "transparent",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {skill.textIcon}
                                    </div>
                                )}

                                {/* Name label */}
                                <span
                                    style={{
                                        fontSize: "8px",
                                        fontWeight: 700,
                                        letterSpacing: "0.07em",
                                        textTransform: "uppercase",
                                        color: "#FFD700",
                                        whiteSpace: "nowrap",
                                        opacity: named ? 1 : 0,
                                        transition: "opacity 0.25s ease",
                                        pointerEvents: "none",
                                        fontFamily: "system-ui, -apple-system, sans-serif",
                                        textShadow: "0 0 8px rgba(255,215,0,0.7)",
                                        lineHeight: 1,
                                    }}
                                >
                                    {skill.name}
                                </span>
                            </div>
                        );
                    })}

                    {/* Tooltip — only in "all" mode (no category active) */}
                    {tooltip && hoveredSkill !== null && effectiveCategory === "all" && (
                        <div
                            className="absolute pointer-events-none z-30 px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase whitespace-nowrap"
                            style={{
                                left: `${tooltip.x}px`,
                                top: `${tooltip.y}px`,
                                transform: "translateX(-50%)",
                                background: "rgba(0,0,0,0.9)",
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

                {/* Ambient glow when category active */}
                {effectiveCategory !== "all" && (
                    <div
                        className="absolute inset-0 pointer-events-none z-0"
                        style={{
                            background: "radial-gradient(ellipse at center, rgba(255,215,0,0.03) 0%, transparent 70%)",
                        }}
                    />
                )}
            </div>
        </section>
    );
}
