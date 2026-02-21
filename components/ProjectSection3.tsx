"use client";

import { useEffect, useRef, useState } from "react";

interface Project {
    id: number;
    name: string;
    description: string;
    techStack: string[];
    liveUrl: string | null;
    githubUrl: string;
}

export default function ProjectsSection3() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [poweredOn, setPoweredOn] = useState<number[]>([]);
    const [activeCard, setActiveCard] = useState<number | null>(null);

    const projects: Project[] = [
        {
            id: 1,
            name: "SaaS Project Management",
            description: "Backend system for teams. Auth, workspaces, tasks, role-based permissions.",
            techStack: ["Node.js", "Express", "MongoDB", "JWT"],
            liveUrl: null,
            githubUrl: "https://github.com/ujjawal8461/project-management-backend"
        },
        {
            id: 2,
            name: "Netflix Clone",
            description: "Full Netflix UI recreation with movie browsing and categories.",
            techStack: ["React", "CSS", "TMDB API"],
            liveUrl: "https://netflix-clone-b098km9aa-ujjawal-singh-solankis-projects.vercel.app/",
            githubUrl: "https://github.com/ujjawal8461/netflix-clone"
        },
        {
            id: 3,
            name: "Rock Paper Scissors",
            description: "Classic game with score tracking and smooth interactions.",
            techStack: ["HTML", "CSS", "JavaScript"],
            liveUrl: "https://rock-paper-scissor-livid-tau.vercel.app/",
            githubUrl: "https://github.com/ujjawal8461/Rock-Paper-Scissor.git"
        },
        {
            id: 4,
            name: "Portfolio",
            description: "This site. Next.js, canvas physics, scroll-driven animations.",
            techStack: ["Next.js", "TypeScript", "Canvas API"],
            liveUrl: null,
            githubUrl: "https://github.com/ujjawal8461/portfolio.git"
        },
        {
            id: 5,
            name: "Aesthetic Landing Page",
            description: "Visual-first landing page with bold typography and design.",
            techStack: ["HTML", "CSS", "JavaScript"],
            liveUrl: "https://landing-page-fgbqqol7g-ujjawal-singh-solankis-projects.vercel.app/",
            githubUrl: "https://github.com/ujjawal8461/aesthetic-page.git"
        }
    ];

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const handleScroll = () => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionScrollHeight = rect.height - windowHeight;
            const scrolledPastTop = -rect.top;
            const progress = Math.max(0, Math.min(1, scrolledPastTop / sectionScrollHeight));
            setScrollProgress(progress);

            const totalProjects = projects.length;
            const newPowered: number[] = [];
            projects.forEach((p, i) => {
                const threshold = (i + 1) / (totalProjects + 1);
                if (progress >= threshold) {
                    newPowered.push(p.id);
                }
            });
            setPoweredOn(newPowered);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isPowered = (id: number) => poweredOn.includes(id);

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-black"
            style={{ height: "300vh" }}
        >
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center py-8 px-6">

                <h2
                    className="text-center text-5xl md:text-6xl font-bold mb-12 tracking-[0.25em] uppercase"
                    style={{
                        color: scrollProgress > 0.05 ? "#FFD700" : "#888",
                        textShadow: scrollProgress > 0.05 ? "0 0 50px rgba(255,215,0,0.5)" : "none",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        fontFamily: "system-ui, -apple-system, sans-serif"
                    }}
                >
                    PROJECTS
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gridTemplateRows: "auto auto",
                        gap: "16px",
                        width: "100%",
                        maxWidth: "900px"
                    }}
                >
                    {projects.map((project, idx) => {
                        const on = isPowered(project.id);
                        const isActive = activeCard === project.id;
                        const isLarge = idx === 0 || idx === 4;

                        return (
                            <div
                                key={project.id}
                                onMouseEnter={() => on && setActiveCard(project.id)}
                                onMouseLeave={() => setActiveCard(null)}
                                style={{
                                    gridColumn: isLarge ? "span 2" : "span 1",
                                    position: "relative",
                                    cursor: on ? "default" : "default",
                                    transition: "transform 0.3s ease",
                                    transform: on && isActive ? "scale(1.02)" : "scale(1)"
                                }}
                            >
                                {/* Monitor outer shell */}
                                <div
                                    style={{
                                        border: "2px solid " + (on ? (isActive ? "#FFD700" : "rgba(255,215,0,0.35)") : "#1a1a1a"),
                                        borderRadius: "6px",
                                        background: on ? "rgba(255,215,0,0.03)" : "#0a0a0a",
                                        transition: "all 0.6s ease",
                                        boxShadow: on
                                            ? (isActive ? "0 0 40px rgba(255,215,0,0.3), inset 0 0 30px rgba(255,215,0,0.04)" : "0 0 20px rgba(255,215,0,0.15)")
                                            : "none",
                                        overflow: "hidden",
                                        minHeight: "180px",
                                        padding: "20px"
                                    }}
                                >
                                    {/* Scanline overlay when powered on */}
                                    {on && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
                                                pointerEvents: "none",
                                                zIndex: 1
                                            }}
                                        />
                                    )}

                                    {/* Power indicator dot */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "12px",
                                            right: "12px",
                                            width: "6px",
                                            height: "6px",
                                            borderRadius: "50%",
                                            background: on ? "#FFD700" : "#222",
                                            boxShadow: on ? "0 0 8px rgba(255,215,0,0.9)" : "none",
                                            transition: "all 0.5s ease",
                                            zIndex: 2
                                        }}
                                    />

                                    {/* Content */}
                                    <div style={{ position: "relative", zIndex: 2 }}>
                                        {/* Top bar — like a terminal title bar */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                marginBottom: "14px"
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "0.6rem",
                                                    letterSpacing: "0.2em",
                                                    fontFamily: "var(--font-geist-mono)",
                                                    color: on ? "rgba(255,215,0,0.5)" : "#2a2a2a",
                                                    transition: "all 0.4s ease"
                                                }}
                                            >
                                                {"[ 0" + (idx + 1) + " ]"}
                                            </span>
                                            <div
                                                style={{
                                                    flex: 1,
                                                    height: "1px",
                                                    background: on ? "rgba(255,215,0,0.2)" : "#1a1a1a",
                                                    transition: "all 0.4s ease"
                                                }}
                                            />
                                        </div>

                                        {/* Project name */}
                                        <h3
                                            style={{
                                                fontSize: isLarge ? "1rem" : "0.88rem",
                                                fontWeight: 700,
                                                letterSpacing: "0.06em",
                                                color: on ? (isActive ? "#FFD700" : "rgba(255,215,0,0.85)") : "#2a2a2a",
                                                textShadow: on && isActive ? "0 0 20px rgba(255,215,0,0.5)" : "none",
                                                margin: "0 0 8px 0",
                                                transition: "all 0.4s ease",
                                                fontFamily: "system-ui, -apple-system, sans-serif",
                                                lineHeight: 1.3
                                            }}
                                        >
                                            {on ? project.name : "-- -- -- -- --"}
                                        </h3>

                                        {/* Description */}
                                        <p
                                            style={{
                                                fontSize: "0.73rem",
                                                color: on ? "rgba(140,140,140,0.9)" : "#1e1e1e",
                                                lineHeight: 1.6,
                                                margin: "0 0 12px 0",
                                                transition: "all 0.4s ease 0.1s",
                                                fontFamily: "system-ui, -apple-system, sans-serif"
                                            }}
                                        >
                                            {on ? project.description : "-- -- -- -- -- -- -- --"}
                                        </p>

                                        {/* Tech stack */}
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "14px" }}>
                                            {project.techStack.map((tech, i) => (
                                                <span
                                                    key={i}
                                                    style={{
                                                        fontSize: "0.58rem",
                                                        letterSpacing: "0.12em",
                                                        textTransform: "uppercase",
                                                        padding: "2px 6px",
                                                        borderRadius: "2px",
                                                        background: on ? "rgba(255,215,0,0.08)" : "rgba(255,255,255,0.02)",
                                                        color: on ? "rgba(255,215,0,0.55)" : "#1a1a1a",
                                                        border: "1px solid " + (on ? "rgba(255,215,0,0.15)" : "#111"),
                                                        transition: "all 0.3s ease " + (i * 0.05) + "s",
                                                        fontFamily: "var(--font-geist-mono)"
                                                    }}
                                                >
                                                    {on ? tech : "---"}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Links */}
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <a
                                                href={on ? project.githubUrl : "#"}
                                                target={on ? "_blank" : "_self"}
                                                rel="noopener noreferrer"
                                                onClick={(e) => { if (!on) e.preventDefault(); }}
                                                style={{
                                                    fontSize: "0.62rem",
                                                    letterSpacing: "0.14em",
                                                    fontWeight: 600,
                                                    padding: "4px 12px",
                                                    borderRadius: "2px",
                                                    background: "transparent",
                                                    color: on ? "rgba(255,215,0,0.65)" : "#222",
                                                    border: "1px solid " + (on ? "rgba(255,215,0,0.2)" : "#1a1a1a"),
                                                    textDecoration: "none",
                                                    transition: "all 0.3s ease",
                                                    fontFamily: "var(--font-geist-mono)",
                                                    pointerEvents: on ? "auto" : "none"
                                                }}
                                            >
                                                GH
                                            </a>
                                            <a
                                                href={on && project.liveUrl ? project.liveUrl : "#"}
                                                target={on && project.liveUrl ? "_blank" : "_self"}
                                                rel="noopener noreferrer"
                                                onClick={(e) => { if (!on || !project.liveUrl) e.preventDefault(); }}
                                                style={{
                                                    fontSize: "0.62rem",
                                                    letterSpacing: "0.14em",
                                                    fontWeight: 600,
                                                    padding: "4px 12px",
                                                    borderRadius: "2px",
                                                    background: on ? "rgba(255,215,0,0.1)" : "transparent",
                                                    color: on ? "#FFD700" : "#222",
                                                    border: "1px solid " + (on ? "rgba(255,215,0,0.3)" : "#1a1a1a"),
                                                    textDecoration: "none",
                                                    transition: "all 0.3s ease",
                                                    fontFamily: "var(--font-geist-mono)",
                                                    pointerEvents: on ? "auto" : "none",
                                                    opacity: on && project.liveUrl ? 1 : 0.35
                                                }}
                                            >
                                                LIVE
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <p
                    style={{
                        marginTop: "28px",
                        fontSize: "0.58rem",
                        letterSpacing: "0.32em",
                        color: "#272727",
                        textTransform: "uppercase",
                        fontFamily: "system-ui, -apple-system, sans-serif"
                    }}
                >
                    scroll to power on
                </p>
            </div>
        </section>
    );
}
