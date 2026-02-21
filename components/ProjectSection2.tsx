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

    const projects: Project[] = [
        {
            id: 1,
            name: "SaaS Project Management",
            description: "A backend-driven project management system built for teams. Handles auth, workspaces, tasks, and role-based permissions.",
            techStack: ["Node.js", "Express", "MongoDB", "JWT", "REST API"],
            liveUrl: null,
            githubUrl: "https://github.com/ujjawal8461/project-management-backend",
            unlockAt: 0.1
        },
        {
            id: 2,
            name: "Netflix Clone",
            description: "A faithful recreation of Netflix UI with movie browsing, categories, and responsive layout.",
            techStack: ["React", "CSS", "TMDB API", "Vercel"],
            liveUrl: "https://netflix-clone-b098km9aa-ujjawal-singh-solankis-projects.vercel.app/",
            githubUrl: "https://github.com/ujjawal8461/netflix-clone",
            unlockAt: 0.3
        },
        {
            id: 3,
            name: "Rock Paper Scissors",
            description: "Classic game with clean UI, score tracking, and smooth interactions.",
            techStack: ["HTML", "CSS", "JavaScript"],
            liveUrl: "https://rock-paper-scissor-livid-tau.vercel.app/",
            githubUrl: "https://github.com/ujjawal8461/Rock-Paper-Scissor.git",
            unlockAt: 0.5
        },
        {
            id: 4,
            name: "Portfolio",
            description: "This very site. Built with Next.js, canvas physics, and scroll-driven animations.",
            techStack: ["Next.js", "TypeScript", "Canvas API", "Tailwind"],
            liveUrl: null,
            githubUrl: "https://github.com/ujjawal8461/portfolio.git",
            unlockAt: 0.65
        },
        {
            id: 5,
            name: "Aesthetic Landing Page",
            description: "A visual-first landing page with bold typography and strong design sensibility.",
            techStack: ["HTML", "CSS", "JavaScript"],
            liveUrl: "https://landing-page-fgbqqol7g-ujjawal-singh-solankis-projects.vercel.app/",
            githubUrl: "https://github.com/ujjawal8461/aesthetic-page.git",
            unlockAt: 0.8
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
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

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
                        width: "100%",
                        maxWidth: "720px",
                        marginBottom: "2.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem"
                    }}
                >
                    <span
                        style={{
                            color: "#3a3a3a",
                            fontSize: "10px",
                            letterSpacing: "0.2em",
                            fontFamily: "var(--font-space-grotesk)",
                            whiteSpace: "nowrap"
                        }}
                    >
                        CHARGE
                    </span>
                    <div
                        style={{
                            flex: 1,
                            position: "relative",
                            height: "2px",
                            background: "rgba(255,255,255,0.06)",
                            borderRadius: "999px"
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                bottom: 0,
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
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    background: "#FFF",
                                    boxShadow: "0 0 10px rgba(255,215,0,1)",
                                    transform: "translate(-50%, -50%)"
                                }}
                            />
                        )}
                    </div>
                    <span
                        style={{
                            color: "#444",
                            fontSize: "10px",
                            letterSpacing: "0.15em",
                            fontFamily: "var(--font-geist-mono)",
                            whiteSpace: "nowrap"
                        }}
                    >
                        {Math.round(scrollProgress * 100)}%
                    </span>
                </div>

                <div style={{ width: "100%", maxWidth: "720px", display: "flex", flexDirection: "column" }}>
                    {projects.map((project, idx) => {
                        const isUnlocked = scrollProgress >= project.unlockAt;
                        const isHovered = hoveredId === project.id;

                        let borderColor = "#1e1e1e";
                        if (isUnlocked && isHovered) {
                            borderColor = "#FFD700";
                        } else if (isUnlocked) {
                            borderColor = "rgba(255,215,0,0.22)";
                        }

                        const dotBg = isUnlocked ? "#FFD700" : "#2a2a2a";
                        const dotShadow = isUnlocked ? "0 0 8px rgba(255,215,0,0.9)" : "none";
                        const titleColor = isUnlocked ? (isHovered ? "#FFD700" : "rgba(255,215,0,0.88)") : "#444";
                        const titleShadow = isUnlocked && isHovered ? "0 0 18px rgba(255,215,0,0.4)" : "none";
                        const descColor = isUnlocked ? "rgba(150,150,150,0.9)" : "#333";
                        const tagBg = isUnlocked ? "rgba(255,215,0,0.07)" : "rgba(255,255,255,0.02)";
                        const tagColor = isUnlocked ? "rgba(255,215,0,0.6)" : "#2e2e2e";
                        const tagBorder = isUnlocked ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.04)";
                        const githubColor = isUnlocked ? "rgba(255,215,0,0.7)" : "#333";
                        const githubBorder = isUnlocked ? "rgba(255,215,0,0.22)" : "rgba(255,255,255,0.05)";
                        const liveColor = isUnlocked ? "#FFD700" : "#333";
                        const liveBg = isUnlocked ? "rgba(255,215,0,0.09)" : "transparent";
                        const liveBorder = isUnlocked ? "rgba(255,215,0,0.32)" : "rgba(255,255,255,0.05)";
                        const liveOpacity = project.liveUrl !== null ? 1 : 0.38;
                        const rowOpacity = isUnlocked ? 1 : 0.18;
                        const rowTransform = isUnlocked && isHovered ? "translateX(4px)" : "translateX(0)";
                        const ptrEvents: "auto" | "none" = isUnlocked ? "auto" : "none";

                        return (
                            <div
                                key={project.id}
                                onMouseEnter={() => setHoveredId(project.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    opacity: rowOpacity,
                                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1) " + idx * 0.04 + "s",
                                    borderBottom: "1px solid rgba(255,255,255,0.045)",
                                    borderLeft: "2px solid " + borderColor,
                                    padding: "16px 0 16px 22px",
                                    transform: rowTransform
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        gap: "1.5rem",
                                        flexWrap: "wrap"
                                    }}
                                >
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                                            <div
                                                style={{
                                                    width: "7px",
                                                    height: "7px",
                                                    borderRadius: "50%",
                                                    flexShrink: 0,
                                                    background: dotBg,
                                                    boxShadow: dotShadow,
                                                    transition: "all 0.4s ease",
                                                    marginLeft: "-26px",
                                                    marginRight: "16px"
                                                }}
                                            />
                                            <h3
                                                style={{
                                                    fontSize: "clamp(0.88rem, 1.35vw, 1.05rem)",
                                                    fontWeight: 700,
                                                    letterSpacing: "0.07em",
                                                    color: titleColor,
                                                    textShadow: titleShadow,
                                                    transition: "all 0.3s ease",
                                                    fontFamily: "system-ui, -apple-system, sans-serif",
                                                    margin: 0
                                                }}
                                            >
                                                {project.name}
                                            </h3>
                                        </div>

                                        <p
                                            style={{
                                                fontSize: "0.77rem",
                                                color: descColor,
                                                lineHeight: 1.65,
                                                margin: "0 0 10px 0",
                                                transition: "all 0.3s ease",
                                                fontFamily: "system-ui, -apple-system, sans-serif",
                                                maxWidth: "480px"
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
                                                        letterSpacing: "0.14em",
                                                        textTransform: "uppercase",
                                                        padding: "2px 7px",
                                                        borderRadius: "2px",
                                                        background: tagBg,
                                                        color: tagColor,
                                                        border: "1px solid " + tagBorder,
                                                        fontFamily: "var(--font-geist-mono)"
                                                    }}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "7px",
                                            flexShrink: 0,
                                            paddingTop: "2px"
                                        }}
                                    >
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                fontSize: "0.67rem",
                                                letterSpacing: "0.14em",
                                                fontWeight: 600,
                                                padding: "5px 14px",
                                                borderRadius: "2px",
                                                background: "transparent",
                                                color: githubColor,
                                                border: "1px solid " + githubBorder,
                                                textDecoration: "none",
                                                pointerEvents: ptrEvents,
                                                transition: "all 0.25s ease",
                                                fontFamily: "system-ui, -apple-system, sans-serif",
                                                display: "block",
                                                textAlign: "center",
                                                whiteSpace: "nowrap"
                                            }}
                                        >
                                            GitHub
                                        </a>
                                        <a
                                            href={project.liveUrl !== null ? project.liveUrl : "#"}
                                            target={project.liveUrl !== null ? "_blank" : "_self"}
                                            rel="noopener noreferrer"
                                            onClick={(e) => {
                                                if (project.liveUrl === null) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            style={{
                                                fontSize: "0.67rem",
                                                letterSpacing: "0.14em",
                                                fontWeight: 600,
                                                padding: "5px 14px",
                                                borderRadius: "2px",
                                                background: liveBg,
                                                color: liveColor,
                                                border: "1px solid " + liveBorder,
                                                textDecoration: "none",
                                                pointerEvents: ptrEvents,
                                                transition: "all 0.25s ease",
                                                fontFamily: "system-ui, -apple-system, sans-serif",
                                                display: "block",
                                                textAlign: "center",
                                                whiteSpace: "nowrap",
                                                opacity: liveOpacity
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
                    scroll to unlock
                </p>
            </div>
        </section>
    );
}
