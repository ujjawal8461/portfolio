"use client";

import { useEffect, useRef, useState } from "react";

interface Project {
    id: number;
    name: string;
    description: string;
    details: string;
    techStack: string[];
    liveUrl?: string;
    githubUrl?: string;
    unlockAt: number;
}

export default function ProjectsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [hoveredProject, setHoveredProject] = useState<number | null>(null);

    const projects: Project[] = [
        {
            id: 1,
            name: "E-Commerce Platform",
            description: "Full-stack shopping experience",
            details: "Built a complete e-commerce solution with real-time inventory management, secure payment processing via Stripe, and a comprehensive admin dashboard for managing products, orders, and analytics.",
            techStack: ["React", "Node.js", "MongoDB", "Stripe", "Redis"],
            liveUrl: "https://example.com",
            githubUrl: "https://github.com",
            unlockAt: 0.2
        },
        {
            id: 2,
            name: "Real-Time Chat Application",
            description: "WebSocket-based instant messaging",
            details: "Developed a high-performance chat application with support for group conversations, file sharing, typing indicators, and message encryption for secure communications.",
            techStack: ["Next.js", "Socket.io", "PostgreSQL", "AWS S3"],
            liveUrl: "https://example.com",
            githubUrl: "https://github.com",
            unlockAt: 0.45
        },
        {
            id: 3,
            name: "AI Content Generator",
            description: "Machine learning powered content creation",
            details: "Created an intelligent content generation tool that uses custom-trained models to produce high-quality written content. Features API integration for external services and Docker containerization.",
            techStack: ["Python", "TensorFlow", "React", "FastAPI", "Docker"],
            githubUrl: "https://github.com",
            unlockAt: 0.7
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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d")!;
        const dpr = window.devicePixelRatio || 1;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        let animationFrame: number;
        let particles: Array<{ x: number; y: number; vx: number; vy: number; life: number }> = [];

        const animate = () => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            // Add new particles occasionally
            if (Math.random() < 0.05 && scrollProgress > 0.05) {
                particles.push({
                    x: Math.random() * window.innerWidth,
                    y: window.innerHeight,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: -1 - Math.random() * 2,
                    life: 1
                });
            }

            // Update and draw particles
            particles = particles.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.01;

                if (p.life > 0) {
                    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 3);
                    gradient.addColorStop(0, `rgba(255, 215, 0, ${p.life * 0.8})`);
                    gradient.addColorStop(1, `rgba(255, 215, 0, 0)`);

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                    return true;
                }
                return false;
            });

            // Draw energy lines connecting between sections
            if (scrollProgress > 0.1) {
                ctx.strokeStyle = `rgba(255, 215, 0, ${0.1 + scrollProgress * 0.2})`;
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
                ctx.lineDashOffset = -Date.now() / 50;

                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(0, window.innerHeight * (0.3 + i * 0.2));
                    ctx.lineTo(window.innerWidth, window.innerHeight * (0.3 + i * 0.2));
                    ctx.stroke();
                }
                ctx.setLineDash([]);
            }

            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [scrollProgress]);

    const isProjectUnlocked = (project: Project) => {
        return scrollProgress >= project.unlockAt;
    };

    const getProjectProgress = (project: Project) => {
        const unlockRange = 0.15;
        const startUnlock = project.unlockAt - unlockRange;
        const progress = (scrollProgress - startUnlock) / unlockRange;
        return Math.max(0, Math.min(1, progress));
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-black"
            style={{ minHeight: "250vh" }}
        >
            <canvas
                ref={canvasRef}
                className="fixed top-0 left-0 pointer-events-none"
                style={{ zIndex: 1 }}
            />

            <div className="sticky top-0 min-h-screen flex flex-col items-center justify-center py-16 px-4 md:px-8"
                style={{ zIndex: 2 }}
            >
                {/* Title */}
                <div className="relative mb-20">
                    <h2
                        className="text-center text-5xl md:text-7xl font-bold tracking-[0.3em] uppercase"
                        style={{
                            color: scrollProgress > 0.05 ? "#FFD700" : "#888",
                            textShadow: scrollProgress > 0.05
                                ? "0 0 60px rgba(255,215,0,0.6), 0 0 100px rgba(255,215,0,0.3)"
                                : "none",
                            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                            fontFamily: "system-ui, -apple-system, sans-serif"
                        }}
                    >
                        PROJECTS
                    </h2>

                    {scrollProgress > 0.05 && (
                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1"
                            style={{
                                background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.8), transparent)",
                                boxShadow: "0 0 20px rgba(255,215,0,0.5)",
                                animation: "shimmer 3s ease-in-out infinite"
                            }}
                        />
                    )}
                </div>

                {/* Projects Container */}
                <div className="max-w-6xl w-full space-y-12 md:space-y-20">
                    {projects.map((project, index) => {
                        const isUnlocked = isProjectUnlocked(project);
                        const progress = getProjectProgress(project);
                        const intensity = progress;

                        return (
                            <div
                                key={project.id}
                                className="relative"
                                onMouseEnter={() => setHoveredProject(project.id)}
                                onMouseLeave={() => setHoveredProject(null)}
                            >
                                {/* Project Number & Progress Bar */}
                                <div className="flex items-center gap-6 mb-6">
                                    <div
                                        className="text-6xl md:text-8xl font-black tracking-tighter"
                                        style={{
                                            color: isUnlocked ? "#FFD700" : "#333",
                                            textShadow: isUnlocked
                                                ? `0 0 40px rgba(255,215,0,${intensity * 0.8})`
                                                : "none",
                                            transition: "all 0.6s ease",
                                            fontFamily: "system-ui, -apple-system, sans-serif"
                                        }}
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </div>

                                    {/* Energy Progress Bar */}
                                    <div className="flex-1 relative h-3 bg-gray-900 rounded-full overflow-hidden">
                                        {/* Background grid pattern */}
                                        <div className="absolute inset-0 opacity-20"
                                            style={{
                                                backgroundImage: "repeating-linear-gradient(90deg, #444 0px, #444 2px, transparent 2px, transparent 10px)"
                                            }}
                                        />

                                        {/* Filled progress */}
                                        <div
                                            className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${progress * 100}%`,
                                                background: "linear-gradient(90deg, rgba(255,180,0,0.8), rgba(255,215,0,1))",
                                                boxShadow: isUnlocked
                                                    ? `0 0 20px rgba(255,215,0,0.8), inset 0 0 10px rgba(255,255,255,0.5)`
                                                    : "none"
                                            }}
                                        />

                                        {/* Animated glow at the end */}
                                        {progress > 0 && progress < 1 && (
                                            <div
                                                className="absolute top-0 h-full w-8"
                                                style={{
                                                    left: `${progress * 100}%`,
                                                    background: "radial-gradient(circle, rgba(255,255,255,1), rgba(255,215,0,0.5), transparent)",
                                                    filter: "blur(3px)",
                                                    transform: "translateX(-50%)",
                                                    animation: "pulse 1s ease-in-out infinite"
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Lock/Unlock icon */}
                                    <div className="text-3xl">
                                        {isUnlocked ? (
                                            <div style={{
                                                color: "#FFD700",
                                                filter: `drop-shadow(0 0 10px rgba(255,215,0,${intensity * 0.8}))`
                                            }}>
                                                ⚡
                                            </div>
                                        ) : (
                                            <div style={{ color: "#555" }}>🔒</div>
                                        )}
                                    </div>
                                </div>

                                {/* Main Project Card */}
                                <div
                                    className="relative overflow-hidden rounded-2xl transition-all duration-700"
                                    style={{
                                        background: isUnlocked
                                            ? "linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,180,0,0.04))"
                                            : "rgba(15,15,15,0.8)",
                                        border: `2px solid ${isUnlocked ? `rgba(255,215,0,${0.3 + intensity * 0.4})` : "rgba(40,40,40,0.5)"}`,
                                        boxShadow: isUnlocked
                                            ? `0 0 60px rgba(255,215,0,${intensity * 0.3}), inset 0 0 60px rgba(255,215,0,${intensity * 0.05})`
                                            : "none",
                                        transform: hoveredProject === project.id && isUnlocked
                                            ? "translateY(-8px) scale(1.02)"
                                            : "translateY(0) scale(1)",
                                        filter: !isUnlocked ? "grayscale(0.8) brightness(0.5)" : "none"
                                    }}
                                >
                                    {/* Animated corner accents */}
                                    {isUnlocked && (
                                        <>
                                            <div className="absolute top-0 left-0 w-32 h-32"
                                                style={{
                                                    background: `radial-gradient(circle at top left, rgba(255,215,0,${intensity * 0.3}), transparent 70%)`,
                                                    animation: "pulse 3s ease-in-out infinite"
                                                }}
                                            />
                                            <div className="absolute bottom-0 right-0 w-32 h-32"
                                                style={{
                                                    background: `radial-gradient(circle at bottom right, rgba(255,215,0,${intensity * 0.3}), transparent 70%)`,
                                                    animation: "pulse 3s ease-in-out infinite 1.5s"
                                                }}
                                            />
                                        </>
                                    )}

                                    {/* Circuit pattern overlay */}
                                    {isUnlocked && (
                                        <div className="absolute inset-0 opacity-5"
                                            style={{
                                                backgroundImage: `
                                                    linear-gradient(rgba(255,215,0,1) 1px, transparent 1px),
                                                    linear-gradient(90deg, rgba(255,215,0,1) 1px, transparent 1px)
                                                `,
                                                backgroundSize: "50px 50px"
                                            }}
                                        />
                                    )}

                                    <div className="relative z-10 p-8 md:p-12">
                                        {/* Project Title */}
                                        <h3
                                            className="text-3xl md:text-5xl font-bold mb-4 tracking-wide"
                                            style={{
                                                color: isUnlocked ? "#FFD700" : "#666",
                                                textShadow: isUnlocked
                                                    ? `0 0 30px rgba(255,215,0,${intensity * 0.6})`
                                                    : "none",
                                                transition: "all 0.5s ease"
                                            }}
                                        >
                                            {project.name}
                                        </h3>

                                        {/* Short Description */}
                                        <p
                                            className="text-lg md:text-xl mb-6 font-medium"
                                            style={{
                                                color: isUnlocked ? "rgba(255,215,0,0.7)" : "#555",
                                                transition: "all 0.5s ease"
                                            }}
                                        >
                                            {project.description}
                                        </p>

                                        {/* Detailed Description (shown when unlocked) */}
                                        {isUnlocked && (
                                            <p
                                                className="text-base md:text-lg mb-8 leading-relaxed"
                                                style={{
                                                    color: "rgba(200,200,200,0.9)",
                                                    opacity: intensity,
                                                    transition: "opacity 0.8s ease"
                                                }}
                                            >
                                                {project.details}
                                            </p>
                                        )}

                                        {/* Tech Stack */}
                                        <div className="flex flex-wrap gap-3 mb-8">
                                            {project.techStack.map((tech, techIndex) => (
                                                <span
                                                    key={techIndex}
                                                    className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-wider uppercase"
                                                    style={{
                                                        background: isUnlocked
                                                            ? "rgba(255,215,0,0.15)"
                                                            : "rgba(50,50,50,0.3)",
                                                        color: isUnlocked ? "#FFD700" : "#666",
                                                        border: `1.5px solid ${isUnlocked ? "rgba(255,215,0,0.4)" : "rgba(80,80,80,0.3)"}`,
                                                        boxShadow: isUnlocked
                                                            ? `0 0 15px rgba(255,215,0,${intensity * 0.2})`
                                                            : "none",
                                                        transition: "all 0.5s ease",
                                                        transitionDelay: `${techIndex * 0.1}s`,
                                                        opacity: isUnlocked ? 1 : 0.5
                                                    }}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        {isUnlocked && (
                                            <div className="flex flex-wrap gap-4"
                                                style={{
                                                    opacity: intensity,
                                                    transition: "opacity 0.6s ease 0.3s"
                                                }}
                                            >
                                                {project.liveUrl && (
                                                    <a
                                                        href={project.liveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group px-8 py-4 rounded-xl font-bold text-base tracking-wide uppercase transition-all duration-300"
                                                        style={{
                                                            background: "linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,180,0,0.2))",
                                                            border: "2px solid rgba(255,215,0,0.6)",
                                                            color: "#FFD700",
                                                            boxShadow: "0 0 30px rgba(255,215,0,0.4)"
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.boxShadow = "0 0 50px rgba(255,215,0,0.7)";
                                                            e.currentTarget.style.transform = "translateY(-3px)";
                                                            e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,215,0,0.4), rgba(255,180,0,0.3))";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.boxShadow = "0 0 30px rgba(255,215,0,0.4)";
                                                            e.currentTarget.style.transform = "translateY(0)";
                                                            e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,180,0,0.2))";
                                                        }}
                                                    >
                                                        View Live →
                                                    </a>
                                                )}
                                                {project.githubUrl && (
                                                    <a
                                                        href={project.githubUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-8 py-4 rounded-xl font-bold text-base tracking-wide uppercase transition-all duration-300"
                                                        style={{
                                                            background: "rgba(255,215,0,0.05)",
                                                            border: "2px solid rgba(255,215,0,0.3)",
                                                            color: "rgba(255,215,0,0.8)",
                                                            boxShadow: "0 0 20px rgba(255,215,0,0.2)"
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = "rgba(255,215,0,0.1)";
                                                            e.currentTarget.style.boxShadow = "0 0 35px rgba(255,215,0,0.4)";
                                                            e.currentTarget.style.borderColor = "rgba(255,215,0,0.5)";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = "rgba(255,215,0,0.05)";
                                                            e.currentTarget.style.boxShadow = "0 0 20px rgba(255,215,0,0.2)";
                                                            e.currentTarget.style.borderColor = "rgba(255,215,0,0.3)";
                                                        }}
                                                    >
                                                        GitHub
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Hover scan line effect */}
                                    {hoveredProject === project.id && isUnlocked && (
                                        <div
                                            className="absolute inset-0 pointer-events-none"
                                            style={{
                                                background: "linear-gradient(180deg, transparent, rgba(255,215,0,0.1), transparent)",
                                                animation: "scanLine 2s linear infinite"
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer hint */}
                <div
                    className="text-center text-xs tracking-[0.4em] uppercase mt-16"
                    style={{
                        color: scrollProgress < 0.95 ? "#555" : "#333",
                        opacity: scrollProgress < 0.95 ? 0.8 : 0.3,
                        transition: "all 0.6s ease"
                    }}
                >
                    Scroll to power up • Unlock all projects
                </div>

                <style jsx>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(200%); }
                    }
                    
                    @keyframes pulse {
                        0%, 100% { opacity: 0.6; }
                        50% { opacity: 1; }
                    }
                    
                    @keyframes scanLine {
                        0% { transform: translateY(-100%); }
                        100% { transform: translateY(200%); }
                    }
                `}</style>
            </div>
        </section>
    );
}