"use client";

import { useEffect, useRef, useState } from "react";

export default function ProjectsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const projects = [
        {
            id: 1,
            name: "E-Commerce Platform",
            description: "Full-stack online marketplace with real-time inventory, payment integration, and admin dashboard",
            techStack: ["React", "Node.js", "MongoDB", "Stripe", "Redux"],
            liveUrl: "https://example.com",
            githubUrl: "https://github.com/username/project1",
            unlockAt: 0.15
        },
        {
            id: 2,
            name: "AI Content Generator",
            description: "Machine learning powered content creation tool with natural language processing",
            techStack: ["Next.js", "TypeScript", "OpenAI", "PostgreSQL", "Tailwind"],
            liveUrl: "https://example.com",
            githubUrl: "https://github.com/username/project2",
            unlockAt: 0.35
        },
        {
            id: 3,
            name: "Real-Time Analytics Dashboard",
            description: "Interactive data visualization platform with live updates and custom reporting",
            techStack: ["React", "D3.js", "Express", "WebSocket", "MySQL"],
            liveUrl: "https://example.com",
            githubUrl: "https://github.com/username/project3",
            unlockAt: 0.55
        },
        {
            id: 4,
            name: "Social Media Aggregator",
            description: "Unified platform to manage multiple social media accounts with scheduling features",
            techStack: ["Next.js", "GraphQL", "Redis", "OAuth", "Material UI"],
            liveUrl: "https://example.com",
            githubUrl: "https://github.com/username/project4",
            unlockAt: 0.75
        }
    ];

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const handleScroll = () => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top <= 0 && rect.bottom > windowHeight) {
                const scrolledPastTop = -rect.top;
                const sectionScrollHeight = rect.height - windowHeight;
                const progress = Math.max(0, Math.min(1, scrolledPastTop / sectionScrollHeight));
                setScrollProgress(progress);
            } else if (rect.top > 0) {
                setScrollProgress(0);
            } else if (rect.bottom <= windowHeight) {
                setScrollProgress(1);
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const isProjectUnlocked = (unlockThreshold: number) => {
        return scrollProgress >= unlockThreshold;
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-black"
            style={{ minHeight: "250vh" }}
        >
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center py-12 px-4">
                {/* Title */}
                <h2
                    className="text-center text-5xl md:text-6xl font-bold mb-8 tracking-[0.25em] uppercase"
                    style={{
                        color: scrollProgress > 0.05 ? "#FFD700" : "#888",
                        textShadow: scrollProgress > 0.05 ? "0 0 50px rgba(255,215,0,0.5)" : "none",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        fontFamily: "system-ui, -apple-system, sans-serif"
                    }}
                >
                    PROJECTS UNLEASHED
                </h2>

                {/* Energy Bar Container */}
                <div className="w-full max-w-4xl mb-12">
                    <div className="relative h-12 rounded-full overflow-hidden"
                        style={{
                            background: "linear-gradient(90deg, rgba(50,50,50,0.3), rgba(30,30,30,0.5))",
                            border: "2px solid rgba(100,100,100,0.3)",
                            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)"
                        }}
                    >
                        {/* Energy Fill */}
                        <div
                            className="absolute inset-0 transition-all duration-300 ease-out"
                            style={{
                                width: `${scrollProgress * 100}%`,
                                background: "linear-gradient(90deg, rgba(255,215,0,0.8), rgba(255,180,0,0.9), rgba(255,215,0,0.8))",
                                boxShadow: `
                                    0 0 30px rgba(255,215,0,0.6),
                                    inset 0 0 20px rgba(255,255,150,0.4)
                                `,
                                filter: "blur(1px)"
                            }}
                        >
                            {/* Energy Pulse Animation */}
                            <div
                                className="absolute inset-0 opacity-60"
                                style={{
                                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
                                    animation: "energyPulse 2s linear infinite"
                                }}
                            />
                        </div>

                        {/* Glow Effect */}
                        {scrollProgress > 0 && (
                            <div
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none"
                                style={{
                                    background: "radial-gradient(circle, rgba(255,215,0,0.4), transparent 70%)",
                                    filter: "blur(20px)",
                                    animation: "glowPulse 2s ease-in-out infinite"
                                }}
                            />
                        )}

                        {/* Energy Text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span
                                className="text-sm font-bold tracking-widest"
                                style={{
                                    color: scrollProgress > 0.1 ? "#FFF" : "#666",
                                    textShadow: scrollProgress > 0.1 ? "0 0 10px rgba(255,255,255,0.8)" : "none",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                ⚡ ENERGY: {Math.round(scrollProgress * 100)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
                    {projects.map((project, index) => {
                        const isUnlocked = isProjectUnlocked(project.unlockAt);
                        const intensity = isUnlocked ? 1 : 0;

                        return (
                            <div
                                key={project.id}
                                className="relative"
                                style={{
                                    opacity: isUnlocked ? 1 : 0.3,
                                    transform: isUnlocked ? "scale(1)" : "scale(0.95)",
                                    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                                    transitionDelay: `${index * 0.1}s`
                                }}
                            >
                                {/* Outer Glow */}
                                {isUnlocked && (
                                    <div
                                        className="absolute inset-0 rounded-lg"
                                        style={{
                                            background: `radial-gradient(circle at center, rgba(255, 215, 0, ${intensity * 0.2}), transparent 70%)`,
                                            filter: "blur(25px)",
                                            transform: "scale(1.05)",
                                            animation: "projectGlow 3s ease-in-out infinite"
                                        }}
                                    />
                                )}

                                {/* Card */}
                                <div
                                    className="relative p-6 rounded-lg overflow-hidden"
                                    style={{
                                        backgroundColor: isUnlocked ? "rgba(255, 215, 0, 0.05)" : "rgba(20, 20, 20, 0.5)",
                                        border: `2px solid ${isUnlocked ? `rgba(255, 215, 0, ${intensity * 0.6})` : "rgba(50, 50, 50, 0.3)"}`,
                                        boxShadow: isUnlocked
                                            ? `0 0 40px rgba(255, 215, 0, ${intensity * 0.4}), inset 0 0 30px rgba(255, 215, 0, ${intensity * 0.1})`
                                            : "none",
                                        minHeight: "280px"
                                    }}
                                >
                                    {/* Shimmer Effect */}
                                    {isUnlocked && (
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background: "linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.15), transparent)",
                                                animation: "shimmer 3s ease-in-out infinite"
                                            }}
                                        />
                                    )}

                                    {/* Lock Icon for Locked Projects */}
                                    {!isUnlocked && (
                                        <div className="absolute top-4 right-4">
                                            <span className="text-2xl opacity-50">🔒</span>
                                        </div>
                                    )}

                                    <div className="relative z-10">
                                        {/* Project Name */}
                                        <h3
                                            className="text-2xl font-bold mb-3 tracking-wide"
                                            style={{
                                                color: isUnlocked ? "#FFD700" : "#666",
                                                textShadow: isUnlocked ? `0 0 20px rgba(255, 215, 0, ${intensity * 0.7})` : "none",
                                                transition: "all 0.4s ease"
                                            }}
                                        >
                                            {isUnlocked ? "✨ " : ""}{project.name}
                                        </h3>

                                        {/* Description */}
                                        <p
                                            className="text-sm mb-4 leading-relaxed"
                                            style={{
                                                color: isUnlocked ? "rgba(200, 200, 200, 0.9)" : "#555",
                                                transition: "all 0.4s ease"
                                            }}
                                        >
                                            {project.description}
                                        </p>

                                        {/* Tech Stack */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.techStack.map((tech, techIndex) => (
                                                <span
                                                    key={techIndex}
                                                    className="text-xs px-2.5 py-1 rounded"
                                                    style={{
                                                        backgroundColor: isUnlocked ? "rgba(255, 215, 0, 0.15)" : "rgba(80, 80, 80, 0.2)",
                                                        color: isUnlocked ? "rgba(255, 240, 180, 0.95)" : "#666",
                                                        border: `1px solid ${isUnlocked ? "rgba(255, 215, 0, 0.3)" : "rgba(80, 80, 80, 0.3)"}`,
                                                        transition: "all 0.4s ease",
                                                        transitionDelay: `${techIndex * 0.05}s`
                                                    }}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 rounded text-sm font-semibold transition-all duration-300"
                                                style={{
                                                    backgroundColor: isUnlocked ? "rgba(255, 215, 0, 0.2)" : "rgba(60, 60, 60, 0.3)",
                                                    color: isUnlocked ? "#FFD700" : "#555",
                                                    border: `1px solid ${isUnlocked ? "rgba(255, 215, 0, 0.5)" : "rgba(80, 80, 80, 0.4)"}`,
                                                    cursor: isUnlocked ? "pointer" : "not-allowed",
                                                    pointerEvents: isUnlocked ? "auto" : "none",
                                                    boxShadow: isUnlocked ? "0 0 15px rgba(255, 215, 0, 0.3)" : "none"
                                                }}
                                            >
                                                Live Demo →
                                            </a>
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 rounded text-sm font-semibold transition-all duration-300"
                                                style={{
                                                    backgroundColor: isUnlocked ? "rgba(255, 215, 0, 0.1)" : "rgba(50, 50, 50, 0.3)",
                                                    color: isUnlocked ? "rgba(255, 240, 180, 0.9)" : "#555",
                                                    border: `1px solid ${isUnlocked ? "rgba(255, 215, 0, 0.4)" : "rgba(80, 80, 80, 0.4)"}`,
                                                    cursor: isUnlocked ? "pointer" : "not-allowed",
                                                    pointerEvents: isUnlocked ? "auto" : "none"
                                                }}
                                            >
                                                GitHub
                                            </a>
                                        </div>
                                    </div>

                                    {/* Corner Accents */}
                                    {isUnlocked && (
                                        <>
                                            <div
                                                className="absolute top-0 left-0 w-12 h-12"
                                                style={{
                                                    background: `linear-gradient(135deg, rgba(255, 215, 0, ${intensity * 0.4}), transparent)`,
                                                    borderTopLeftRadius: "8px"
                                                }}
                                            />
                                            <div
                                                className="absolute bottom-0 right-0 w-12 h-12"
                                                style={{
                                                    background: `linear-gradient(-45deg, rgba(255, 215, 0, ${intensity * 0.4}), transparent)`,
                                                    borderBottomRightRadius: "8px"
                                                }}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Scroll Hint */}
                <div
                    className="text-center text-xs tracking-[0.35em] uppercase mt-10"
                    style={{
                        color: scrollProgress < 0.95 ? "#555" : "#222",
                        opacity: scrollProgress < 0.95 ? 0.7 : 0,
                        transition: "all 0.5s ease"
                    }}
                >
                    Scroll to charge energy • Unlock all projects
                </div>
            </div>

            {/* Animations */}
            <style jsx>{`
                @keyframes energyPulse {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                @keyframes glowPulse {
                    0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                }
                
                @keyframes projectGlow {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </section>
    );
}