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
    position: number;
}

export default function ProjectsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [hoveredProject, setHoveredProject] = useState<number | null>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 900 });

    const projects: Project[] = [
        {
            id: 1,
            name: "E-Commerce Platform",
            description: "Full-stack shopping experience",
            details: "Built a complete e-commerce solution with real-time inventory management, secure payment processing via Stripe, and a comprehensive admin dashboard for managing products, orders, and analytics.",
            techStack: ["React", "Node.js", "MongoDB", "Stripe", "Redis"],
            liveUrl: "https://example.com",
            githubUrl: "https://github.com",
            position: 0.25
        },
        {
            id: 2,
            name: "Real-Time Chat Application",
            description: "WebSocket-based instant messaging",
            details: "Developed a high-performance chat application with support for group conversations, file sharing, typing indicators, and message encryption for secure communications.",
            techStack: ["Next.js", "Socket.io", "PostgreSQL", "AWS S3"],
            liveUrl: "https://example.com",
            githubUrl: "https://github.com",
            position: 0.55
        },
        {
            id: 3,
            name: "AI Content Generator",
            description: "Machine learning powered content creation",
            details: "Created an intelligent content generation tool that uses custom-trained models to produce high-quality written content. Features API integration for external services and Docker containerization.",
            techStack: ["Python", "TensorFlow", "React", "FastAPI", "Docker"],
            githubUrl: "https://github.com",
            position: 0.85
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

        const resizeCanvas = () => {
            const width = Math.min(window.innerWidth * 0.9, 1000);
            const height = Math.min(window.innerHeight * 0.85, 900);

            setCanvasSize({ width, height });

            canvas.width = width;
            canvas.height = height;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        let animationFrame: number;

        const animate = () => {
            ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

            const centerX = canvasSize.width / 2;
            const startY = 80;
            const endY = canvasSize.height - 50;
            const totalHeight = endY - startY;

            // Draw main vertical trunk
            ctx.strokeStyle = "#888";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(centerX, startY);
            ctx.lineTo(centerX, endY);
            ctx.stroke();

            // Draw powered portion of trunk
            if (scrollProgress > 0.05) {
                const poweredY = startY + totalHeight * Math.min(scrollProgress * 1.2, 1);
                ctx.strokeStyle = "#FFD700";
                ctx.lineWidth = 5;
                ctx.shadowBlur = 30;
                ctx.shadowColor = "rgba(255, 215, 0, 0.9)";
                ctx.beginPath();
                ctx.moveTo(centerX, startY);
                ctx.lineTo(centerX, Math.min(poweredY, endY));
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Energy particle on trunk
                if (poweredY < endY) {
                    ctx.beginPath();
                    ctx.arc(centerX, poweredY, 8, 0, Math.PI * 2);
                    ctx.fillStyle = "#FFF";
                    ctx.shadowBlur = 25;
                    ctx.shadowColor = "rgba(255, 255, 0, 1)";
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            // Draw project branches and nodes
            projects.forEach((project, index) => {
                const nodeY = startY + totalHeight * project.position;
                const branchLength = 180;
                const isLeft = index % 2 === 0;
                const branchEndX = isLeft ? centerX - branchLength : centerX + branchLength;

                // Draw horizontal branch
                ctx.strokeStyle = "#888";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(centerX, nodeY);
                ctx.lineTo(branchEndX, nodeY);
                ctx.stroke();

                // Check if powered
                const isPowered = scrollProgress * 1.2 > project.position;

                if (isPowered) {
                    ctx.strokeStyle = "#FFD700";
                    ctx.lineWidth = 4;
                    ctx.shadowBlur = 25;
                    ctx.shadowColor = "rgba(255, 215, 0, 0.9)";
                    ctx.beginPath();
                    ctx.moveTo(centerX, nodeY);
                    ctx.lineTo(branchEndX, nodeY);
                    ctx.stroke();
                    ctx.shadowBlur = 0;

                    // Energy particle on branch
                    const t = (Date.now() / 1000) % 1;
                    const particleX = centerX + (branchEndX - centerX) * t;

                    ctx.beginPath();
                    ctx.arc(particleX, nodeY, 6, 0, Math.PI * 2);
                    ctx.fillStyle = "#FFF";
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = "rgba(255, 255, 0, 1)";
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }

                // Draw node
                const nodeRadius = 15;

                // Node glow if powered
                if (isPowered) {
                    const pulseTime = Date.now() / 1000;
                    const pulse = Math.sin(pulseTime * 2 + project.id) * 0.15 + 0.85;

                    const glowRadius = nodeRadius * 8;
                    const gradient = ctx.createRadialGradient(branchEndX, nodeY, 0, branchEndX, nodeY, glowRadius);
                    gradient.addColorStop(0, `rgba(255, 240, 150, ${pulse * 0.5})`);
                    gradient.addColorStop(0.2, `rgba(255, 220, 120, ${pulse * 0.4})`);
                    gradient.addColorStop(0.5, `rgba(255, 200, 100, ${pulse * 0.25})`);
                    gradient.addColorStop(0.8, `rgba(255, 180, 80, ${pulse * 0.1})`);
                    gradient.addColorStop(1, `rgba(255, 160, 60, 0)`);

                    ctx.beginPath();
                    ctx.arc(branchEndX, nodeY, glowRadius, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }

                // Draw node circle
                ctx.beginPath();
                ctx.arc(branchEndX, nodeY, nodeRadius, 0, Math.PI * 2);

                if (isPowered) {
                    const pulseTime = Date.now() / 1000;
                    const pulse = Math.sin(pulseTime * 2 + project.id) * 0.2 + 0.8;

                    const bulbGradient = ctx.createRadialGradient(branchEndX, nodeY, 0, branchEndX, nodeY, nodeRadius);
                    bulbGradient.addColorStop(0, `rgba(255, 245, 180, ${pulse * 1.0})`);
                    bulbGradient.addColorStop(0.7, `rgba(255, 215, 0, ${pulse * 0.8})`);
                    bulbGradient.addColorStop(1, `rgba(255, 180, 0, ${pulse * 0.6})`);
                    ctx.fillStyle = bulbGradient;
                    ctx.fill();

                    ctx.shadowBlur = 40 * pulse;
                    ctx.shadowColor = "rgba(255, 215, 0, 0.9)";
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                } else {
                    const inactiveGradient = ctx.createRadialGradient(branchEndX, nodeY, 0, branchEndX, nodeY, nodeRadius);
                    inactiveGradient.addColorStop(0, `rgba(200, 200, 200, 0.3)`);
                    inactiveGradient.addColorStop(0.7, `rgba(150, 150, 150, 0.4)`);
                    inactiveGradient.addColorStop(1, `rgba(100, 100, 100, 0.5)`);
                    ctx.fillStyle = inactiveGradient;
                    ctx.fill();
                    ctx.strokeStyle = "#666";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }

                // Draw small box around node
                ctx.strokeStyle = isPowered ? "rgba(255, 215, 0, 0.4)" : "rgba(128, 128, 128, 0.4)";
                ctx.lineWidth = 1;
                ctx.strokeRect(branchEndX - 10, nodeY - 10, 20, 20);
            });

            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [scrollProgress, canvasSize.width, canvasSize.height]);

    const isProjectPowered = (project: Project) => {
        return scrollProgress * 1.2 > project.position;
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-black"
            style={{ minHeight: "250vh" }}
        >
            <div className="sticky top-0 min-h-screen flex flex-col items-center justify-center py-16 px-4 md:px-8"
                style={{ zIndex: 2 }}
            >
                <div className="relative mb-16">
                    <h2
                        className="text-center text-5xl md:text-7xl font-bold tracking-[0.3em] uppercase"
                        style={{
                            color: scrollProgress > 0.05 ? "#FFD700" : "#888",
                            textShadow: scrollProgress > 0.05
                                ? "0 0 60px rgba(255,215,0,0.6), 0 0 100px rgba(255,215,0,0.3)"
                                : "none",
                            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}
                    >
                        PROJECTS
                    </h2>
                </div>

                <div className="relative flex justify-center items-center flex-1 w-full">
                    <div className="relative">
                        <canvas ref={canvasRef} />

                        {/* Project cards */}
                        {projects.map((project, index) => {
                            const centerX = canvasSize.width / 2;
                            const startY = 80;
                            const endY = canvasSize.height - 50;
                            const totalHeight = endY - startY;
                            const nodeY = startY + totalHeight * project.position;
                            const branchLength = 180;
                            const isLeft = index % 2 === 0;
                            const branchEndX = isLeft ? centerX - branchLength : centerX + branchLength;
                            const isPowered = isProjectPowered(project);
                            const intensity = isPowered ? 1 : 0;

                            return (
                                <div
                                    key={project.id}
                                    className="absolute pointer-events-auto"
                                    onMouseEnter={() => setHoveredProject(project.id)}
                                    onMouseLeave={() => setHoveredProject(null)}
                                    style={{
                                        left: isLeft ? `${branchEndX - 420}px` : `${branchEndX + 40}px`,
                                        top: `${nodeY - 150}px`,
                                        width: "380px"
                                    }}
                                >
                                    <div
                                        className="relative overflow-hidden rounded-xl p-6"
                                        style={{
                                            background: isPowered
                                                ? "linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,180,0,0.04))"
                                                : "rgba(15,15,15,0.8)",
                                            border: `2px solid ${isPowered ? `rgba(255,215,0,${0.3 + intensity * 0.4})` : "rgba(40,40,40,0.5)"}`,
                                            boxShadow: isPowered
                                                ? `0 0 40px rgba(255,215,0,${intensity * 0.3})`
                                                : "none",
                                            transition: "all 0.6s ease",
                                            transform: hoveredProject === project.id && isPowered
                                                ? "translateY(-8px)"
                                                : "translateY(0)",
                                            filter: !isPowered ? "grayscale(0.8) brightness(0.5)" : "none"
                                        }}
                                    >
                                        {isPowered && (
                                            <div className="absolute top-0 left-0 w-24 h-24"
                                                style={{
                                                    background: `radial-gradient(circle at top left, rgba(255,215,0,${intensity * 0.3}), transparent 70%)`
                                                }}
                                            />
                                        )}

                                        <h3
                                            className="text-xl md:text-2xl font-bold mb-2 tracking-wide"
                                            style={{
                                                color: isPowered ? "#FFD700" : "#666",
                                                textShadow: isPowered
                                                    ? `0 0 25px rgba(255,215,0,${intensity * 0.6})`
                                                    : "none",
                                                transition: "all 0.5s ease"
                                            }}
                                        >
                                            {project.name}
                                        </h3>

                                        <p
                                            className="text-sm mb-4 font-medium"
                                            style={{
                                                color: isPowered ? "rgba(255,215,0,0.7)" : "#555",
                                                transition: "all 0.5s ease"
                                            }}
                                        >
                                            {project.description}
                                        </p>

                                        {isPowered && (
                                            <p
                                                className="text-xs mb-4 leading-relaxed"
                                                style={{
                                                    color: "rgba(200,200,200,0.9)",
                                                    opacity: intensity,
                                                    transition: "opacity 0.8s ease"
                                                }}
                                            >
                                                {project.details}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.techStack.map((tech, techIndex) => (
                                                <span
                                                    key={techIndex}
                                                    className="px-3 py-1.5 rounded-md text-xs font-bold tracking-wider uppercase"
                                                    style={{
                                                        background: isPowered
                                                            ? "rgba(255,215,0,0.15)"
                                                            : "rgba(50,50,50,0.3)",
                                                        color: isPowered ? "#FFD700" : "#666",
                                                        border: `1px solid ${isPowered ? "rgba(255,215,0,0.4)" : "rgba(80,80,80,0.3)"}`,
                                                        transition: "all 0.5s ease",
                                                        transitionDelay: `${techIndex * 0.08}s`,
                                                        opacity: isPowered ? 1 : 0.5
                                                    }}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        {isPowered && (
                                            <div className="flex flex-wrap gap-2"
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
                                                        className="px-5 py-2.5 rounded-lg font-bold text-xs tracking-wide uppercase transition-all duration-300"
                                                        style={{
                                                            background: "linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,180,0,0.2))",
                                                            border: "2px solid rgba(255,215,0,0.6)",
                                                            color: "#FFD700"
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.boxShadow = "0 0 30px rgba(255,215,0,0.6)";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.boxShadow = "none";
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
                                                        className="px-5 py-2.5 rounded-lg font-bold text-xs tracking-wide uppercase transition-all duration-300"
                                                        style={{
                                                            background: "rgba(255,215,0,0.05)",
                                                            border: "2px solid rgba(255,215,0,0.3)",
                                                            color: "rgba(255,215,0,0.8)"
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = "rgba(255,215,0,0.1)";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = "rgba(255,215,0,0.05)";
                                                        }}
                                                    >
                                                        GitHub
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div
                    className="text-center text-xs tracking-[0.4em] uppercase mt-8"
                    style={{
                        color: scrollProgress < 0.95 ? "#555" : "#333",
                        opacity: scrollProgress < 0.95 ? 0.8 : 0.3,
                        transition: "all 0.6s ease"
                    }}
                >
                    Scroll to power up projects
                </div>
            </div>
        </section>
    );
}