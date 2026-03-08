"use client";

import { useEffect, useRef, useState } from "react";

interface Project {
    id: number;
    name: string;
    description: string;
    techStack: string[];
    liveUrl: string | null;
    githubUrl: string;
    unlockAt: number;
}

export default function ProjectsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const projects: Project[] = [
        {
            id: 1,
            name: "Netflix Clone",
            description: "A faithful recreation of Netflix UI with movie browsing, categories, and responsive layout.",
            techStack: ["React", "CSS", "TMDB API", "Vercel"],
            liveUrl: "https://netflix-clone-8461.vercel.app/",
            githubUrl: "https://github.com/ujjawal8461/netflix-clone",
            unlockAt: 0.1
        },
        {
            id: 2,
            name: "SaaS Project Management",
            description: "A backend-driven project management system built for teams. Handles auth, workspaces, tasks, and role-based permissions.",
            techStack: ["Node.js", "Express", "MongoDB", "JWT", "REST API"],
            liveUrl: null,
            githubUrl: "https://github.com/ujjawal8461/project-management-backend",
            unlockAt: 0.3
        },
        {
            id: 3,
            name: "Portfolio",
            description: "This very site. Built with Next.js, canvas physics, and scroll-driven animations.",
            techStack: ["Next.js", "TypeScript", "Canvas API", "Tailwind"],
            liveUrl: "https://ujjawal-singh-solanki-portfolio.vercel.app/",
            githubUrl: "https://github.com/ujjawal8461/portfolio.git",
            unlockAt: 0.5
        },
        {
            id: 4,
            name: "Aesthetic Landing Page",
            description: "A visual-first landing page with bold typography and strong design sensibility.",
            techStack: ["HTML", "CSS", "JavaScript"],
            liveUrl: "https://landing-page-aesthetic.vercel.app/",
            githubUrl: "https://github.com/ujjawal8461/aesthetic-page.git",
            unlockAt: 0.8
        }
    ];

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

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
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // On mobile all projects are unlocked immediately
    const getUnlocked = (unlockAt: number) => isMobile ? true : scrollProgress >= unlockAt;

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-black"
            style={{ height: isMobile ? "auto" : "300vh" }}
        >
            <div
                className={isMobile ? "flex flex-col items-center py-12 px-4" : "sticky top-0 h-screen flex flex-col items-center justify-center py-8 px-4 md:px-6"}
            >
                {/* Heading */}
                <h2
                    className="text-center font-bold tracking-[0.25em] uppercase mb-6"
                    style={{
                        fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
                        color: (isMobile || scrollProgress > 0.05) ? "#FFD700" : "#888",
                        textShadow: (isMobile || scrollProgress > 0.05) ? "0 0 50px rgba(255,215,0,0.5)" : "none",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        fontFamily: "system-ui, -apple-system, sans-serif"
                    }}
                >
                    PROJECTS
                </h2>

                {/* Charge bar — hidden on mobile */}
                {!isMobile && (
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "720px",
                            marginBottom: "2rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem"
                        }}
                    >
                        <span style={{ color: "#3a3a3a", fontSize: "10px", letterSpacing: "0.2em", fontFamily: "var(--font-space-grotesk)", whiteSpace: "nowrap" }}>
                            CHARGE
                        </span>
                        <div style={{ flex: 1, position: "relative", height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "999px" }}>
                            <div
                                style={{
                                    position: "absolute", top: 0, left: 0, bottom: 0,
                                    width: Math.round(scrollProgress * 100) + "%",
                                    background: "linear-gradient(90deg, #FFD700, #FFF7A0)",
                                    boxShadow: "0 0 10px rgba(255,215,0,0.6)",
                                    borderRadius: "999px",
                                    transition: "width 0.15s ease"
                                }}
                            />
                            {scrollProgress > 0 && scrollProgress < 1 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        left: Math.round(scrollProgress * 100) + "%",
                                        top: "50%",
                                        width: "8px", height: "8px",
                                        borderRadius: "50%",
                                        background: "#FFF",
                                        boxShadow: "0 0 10px rgba(255,215,0,1)",
                                        transform: "translate(-50%, -50%)"
                                    }}
                                />
                            )}
                        </div>
                        <span style={{ color: "#444", fontSize: "10px", letterSpacing: "0.15em", fontFamily: "var(--font-geist-mono)", whiteSpace: "nowrap" }}>
                            {Math.round(scrollProgress * 100)}%
                        </span>
                    </div>
                )}

                {/* Project list */}
                <div style={{ width: "100%", maxWidth: "720px", display: "flex", flexDirection: "column" }}>
                    {projects.map((project, idx) => {
                        const isUnlocked = getUnlocked(project.unlockAt);
                        const isHovered = hoveredId === project.id;

                        // ── New hover: glow on left border + soft background tint, NO translateX ──
                        const leftBorderColor = !isUnlocked
                            ? "#1e1e1e"
                            : isHovered
                                ? "#FFD700"
                                : "rgba(255,215,0,0.25)";

                        const rowBg = isHovered && isUnlocked
                            ? "rgba(255,215,0,0.03)"
                            : "transparent";

                        const leftBorderShadow = isHovered && isUnlocked
                            ? "inset 3px 0 20px rgba(255,215,0,0.25)"
                            : "none";

                        return (
                            <div
                                key={project.id}
                                onMouseEnter={() => setHoveredId(project.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    opacity: isUnlocked ? 1 : 0.18,
                                    transition: `all 0.45s cubic-bezier(0.4,0,0.2,1) ${idx * 0.04}s`,
                                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                                    borderLeft: `2px solid ${leftBorderColor}`,
                                    padding: isMobile ? "14px 0 14px 16px" : "18px 0 18px 24px",
                                    background: rowBg,
                                    boxShadow: leftBorderShadow,
                                    // NO transform — keeps alignment stable
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        gap: "1rem",
                                    }}
                                >
                                    {/* Left: title + desc + tags */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        {/* Title row with dot */}
                                        <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                                            <div
                                                style={{
                                                    width: "6px", height: "6px",
                                                    borderRadius: "50%",
                                                    flexShrink: 0,
                                                    background: isUnlocked ? "#FFD700" : "#2a2a2a",
                                                    boxShadow: isUnlocked ? "0 0 6px rgba(255,215,0,0.9)" : "none",
                                                    transition: "all 0.4s ease",
                                                    marginLeft: isMobile ? "-20px" : "-28px",
                                                    marginRight: "14px"
                                                }}
                                            />
                                            <h3
                                                style={{
                                                    fontSize: "clamp(0.85rem, 1.4vw, 1rem)",
                                                    fontWeight: 700,
                                                    letterSpacing: "0.06em",
                                                    color: isUnlocked ? "rgba(255,215,0,0.9)" : "#444",
                                                    // Hover: white text instead of glow text-shadow (cleaner)
                                                    transition: "color 0.25s ease",
                                                    fontFamily: "system-ui, -apple-system, sans-serif",
                                                    margin: 0
                                                }}
                                            >
                                                {project.name}
                                            </h3>
                                        </div>

                                        <p
                                            style={{
                                                fontSize: "clamp(0.72rem, 1.1vw, 0.78rem)",
                                                color: isUnlocked ? "rgba(160,160,160,0.9)" : "#333",
                                                lineHeight: 1.65,
                                                margin: "0 0 10px 0",
                                                transition: "color 0.3s ease",
                                                fontFamily: "system-ui, -apple-system, sans-serif",
                                            }}
                                        >
                                            {project.description}
                                        </p>

                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                                            {project.techStack.map((tech, i) => (
                                                <span
                                                    key={i}
                                                    style={{
                                                        fontSize: "0.6rem",
                                                        letterSpacing: "0.12em",
                                                        textTransform: "uppercase",
                                                        padding: "2px 7px",
                                                        borderRadius: "3px",
                                                        background: isUnlocked ? "rgba(255,215,0,0.06)" : "rgba(255,255,255,0.02)",
                                                        color: isUnlocked ? "rgba(255,215,0,0.65)" : "#2e2e2e",
                                                        border: `1px solid ${isUnlocked ? "rgba(255,215,0,0.18)" : "rgba(255,255,255,0.04)"}`,
                                                        fontFamily: "var(--font-geist-mono)",
                                                        transition: "all 0.3s ease"
                                                    }}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right: buttons — row on desktop, stacked on mobile */}
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: isMobile ? "row" : "column",
                                            gap: "6px",
                                            flexShrink: 0,
                                            alignSelf: isMobile ? "flex-end" : "flex-start",
                                            paddingTop: isMobile ? "0" : "2px"
                                        }}
                                    >
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                fontSize: "0.62rem",
                                                letterSpacing: "0.12em",
                                                fontWeight: 600,
                                                padding: "5px 12px",
                                                borderRadius: "4px",
                                                background: "transparent",
                                                color: isUnlocked ? "rgba(255,215,0,0.75)" : "#333",
                                                border: `1px solid ${isUnlocked ? "rgba(255,215,0,0.25)" : "rgba(255,255,255,0.05)"}`,
                                                textDecoration: "none",
                                                pointerEvents: isUnlocked ? "auto" : "none",
                                                transition: "all 0.2s ease",
                                                fontFamily: "system-ui, -apple-system, sans-serif",
                                                display: "block",
                                                textAlign: "center",
                                                whiteSpace: "nowrap"
                                            }}
                                            onMouseEnter={e => {
                                                if (isUnlocked) {
                                                    e.currentTarget.style.background = "rgba(255,215,0,0.08)";
                                                    e.currentTarget.style.borderColor = "rgba(255,215,0,0.5)";
                                                    e.currentTarget.style.color = "#FFD700";
                                                }
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = "transparent";
                                                e.currentTarget.style.borderColor = isUnlocked ? "rgba(255,215,0,0.25)" : "rgba(255,255,255,0.05)";
                                                e.currentTarget.style.color = isUnlocked ? "rgba(255,215,0,0.75)" : "#333";
                                            }}
                                        >
                                            GitHub
                                        </a>
                                        <a
                                            href={project.liveUrl ?? "#"}
                                            target={project.liveUrl ? "_blank" : "_self"}
                                            rel="noopener noreferrer"
                                            onClick={e => { if (!project.liveUrl) e.preventDefault(); }}
                                            style={{
                                                fontSize: "0.62rem",
                                                letterSpacing: "0.12em",
                                                fontWeight: 600,
                                                padding: "5px 12px",
                                                borderRadius: "4px",
                                                background: isUnlocked ? "rgba(255,215,0,0.08)" : "transparent",
                                                color: isUnlocked ? "#FFD700" : "#333",
                                                border: `1px solid ${isUnlocked ? "rgba(255,215,0,0.35)" : "rgba(255,255,255,0.05)"}`,
                                                textDecoration: "none",
                                                pointerEvents: isUnlocked ? "auto" : "none",
                                                transition: "all 0.2s ease",
                                                fontFamily: "system-ui, -apple-system, sans-serif",
                                                display: "block",
                                                textAlign: "center",
                                                whiteSpace: "nowrap",
                                                opacity: project.liveUrl ? 1 : 0.35
                                            }}
                                            onMouseEnter={e => {
                                                if (isUnlocked && project.liveUrl) {
                                                    e.currentTarget.style.background = "rgba(255,215,0,0.15)";
                                                    e.currentTarget.style.boxShadow = "0 0 14px rgba(255,215,0,0.25)";
                                                }
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = isUnlocked ? "rgba(255,215,0,0.08)" : "transparent";
                                                e.currentTarget.style.boxShadow = "none";
                                            }}
                                        >
                                            Live
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Scroll hint — only on desktop */}
                {!isMobile && (
                    <p
                        style={{
                            marginTop: "24px",
                            fontSize: "0.58rem",
                            letterSpacing: "0.32em",
                            color: "#272727",
                            textTransform: "uppercase",
                            fontFamily: "system-ui, -apple-system, sans-serif"
                        }}
                    >
                        scroll to unlock
                    </p>
                )}
            </div>
        </section>
    );
}