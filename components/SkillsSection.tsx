"use client";

import { useEffect, useRef, useState } from "react";

interface SkillNode {
    id: number;
    name: string;
    branch: "frontend" | "backend" | "database" | "tools";
    position: number;
}

export default function SkillsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 900 });

    const skills: SkillNode[] = [
        // Frontend
        { id: 1, name: "HTML", branch: "frontend", position: 0.1 },
        { id: 2, name: "CSS", branch: "frontend", position: 0.15 },
        { id: 3, name: "JavaScript", branch: "frontend", position: 0.2 },
        { id: 4, name: "TypeScript", branch: "frontend", position: 0.25 },
        { id: 5, name: "React.js", branch: "frontend", position: 0.3 },
        { id: 6, name: "Next.js", branch: "frontend", position: 0.35 },
        { id: 7, name: "Tailwind", branch: "frontend", position: 0.4 },
        { id: 8, name: "Redux", branch: "frontend", position: 0.45 },

        // Backend
        { id: 9, name: "Node.js", branch: "backend", position: 0.55 },
        { id: 10, name: "Express.js", branch: "backend", position: 0.6 },
        { id: 11, name: "REST API", branch: "backend", position: 0.65 },
        { id: 12, name: "GraphQL", branch: "backend", position: 0.7 },
        { id: 13, name: "JWT", branch: "backend", position: 0.75 },

        // Database
        { id: 14, name: "MySQL", branch: "database", position: 0.82 },
        { id: 15, name: "MongoDB", branch: "database", position: 0.87 },
        { id: 16, name: "PostgreSQL", branch: "database", position: 0.92 },

        // Tools
        { id: 17, name: "Git", branch: "tools", position: 0.97 },
        { id: 18, name: "GitHub", branch: "tools", position: 1.02 },
        { id: 19, name: "Docker", branch: "tools", position: 1.07 },
        { id: 20, name: "Vercel", branch: "tools", position: 1.12 }
    ];

    const branchStarts = {
        frontend: 0.05,
        backend: 0.5,
        database: 0.8,
        tools: 0.95
    };

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
                const poweredY = startY + totalHeight * Math.min(scrollProgress * 1.3, 1.15);
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

            // Draw horizontal branches
            Object.entries(branchStarts).forEach(([branch, startPos]) => {
                const branchY = startY + totalHeight * startPos;
                const branchLength = 150;
                const isLeft = branch === "frontend" || branch === "database";
                const branchEndX = isLeft ? centerX - branchLength : centerX + branchLength;

                // Draw branch connector
                ctx.strokeStyle = "#888";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(centerX, branchY);
                ctx.lineTo(branchEndX, branchY);
                ctx.stroke();

                // Check if powered
                if (scrollProgress * 1.3 > startPos) {
                    ctx.strokeStyle = "#FFD700";
                    ctx.lineWidth = 4;
                    ctx.shadowBlur = 25;
                    ctx.shadowColor = "rgba(255, 215, 0, 0.9)";
                    ctx.beginPath();
                    ctx.moveTo(centerX, branchY);
                    ctx.lineTo(branchEndX, branchY);
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            });

            // Draw skill nodes
            skills.forEach((skill) => {
                const nodeY = startY + totalHeight * skill.position;
                const branchStart = branchStarts[skill.branch];
                const branchY = startY + totalHeight * branchStart;
                const branchLength = 150;
                const isLeft = skill.branch === "frontend" || skill.branch === "database";
                const branchEndX = isLeft ? centerX - branchLength : centerX + branchLength;

                const isPowered = scrollProgress * 1.3 > skill.position;
                const nodeRadius = 12;

                // Node glow if powered
                if (isPowered) {
                    const pulseTime = Date.now() / 1000;
                    const pulse = Math.sin(pulseTime * 2 + skill.id) * 0.15 + 0.85;

                    const glowRadius = nodeRadius * 6;
                    const gradient = ctx.createRadialGradient(branchEndX, nodeY, 0, branchEndX, nodeY, glowRadius);
                    gradient.addColorStop(0, `rgba(255, 240, 150, ${pulse * 0.4})`);
                    gradient.addColorStop(0.5, `rgba(255, 200, 100, ${pulse * 0.2})`);
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
                    const pulse = Math.sin(pulseTime * 2 + skill.id) * 0.2 + 0.8;

                    const bulbGradient = ctx.createRadialGradient(branchEndX, nodeY, 0, branchEndX, nodeY, nodeRadius);
                    bulbGradient.addColorStop(0, `rgba(255, 245, 180, ${pulse})`);
                    bulbGradient.addColorStop(0.7, `rgba(255, 215, 0, ${pulse * 0.8})`);
                    bulbGradient.addColorStop(1, `rgba(255, 180, 0, ${pulse * 0.6})`);
                    ctx.fillStyle = bulbGradient;
                    ctx.fill();

                    ctx.shadowBlur = 30 * pulse;
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
                ctx.strokeRect(branchEndX - 8, nodeY - 8, 16, 16);
            });

            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [scrollProgress, canvasSize.width, canvasSize.height]);

    const isSkillPowered = (skill: SkillNode) => {
        return scrollProgress * 1.3 > skill.position;
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-black"
            style={{ height: "300vh" }}
        >
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center py-8 px-4">
                <h2
                    className="text-center text-5xl md:text-6xl font-bold mb-12 tracking-[0.25em] uppercase"
                    style={{
                        color: scrollProgress > 0.05 ? "#FFD700" : "#888",
                        textShadow: scrollProgress > 0.05 ? "0 0 50px rgba(255,215,0,0.5)" : "none",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}
                >
                    SKILLS
                </h2>

                <div className="relative flex justify-center items-center flex-1 w-full">
                    <div className="relative">
                        <canvas ref={canvasRef} />

                        {/* Branch labels */}
                        {Object.entries(branchStarts).map(([branch, startPos]) => {
                            const centerX = canvasSize.width / 2;
                            const startY = 80;
                            const endY = canvasSize.height - 50;
                            const totalHeight = endY - startY;
                            const branchY = startY + totalHeight * startPos;
                            const branchLength = 150;
                            const isLeft = branch === "frontend" || branch === "database";
                            const branchEndX = isLeft ? centerX - branchLength : centerX + branchLength;
                            const isPowered = scrollProgress * 1.3 > startPos;

                            return (
                                <div
                                    key={branch}
                                    className="absolute pointer-events-none"
                                    style={{
                                        left: isLeft ? `${branchEndX - 180}px` : `${branchEndX + 25}px`,
                                        top: `${branchY - 30}px`,
                                        textAlign: isLeft ? "right" : "left",
                                        width: "150px"
                                    }}
                                >
                                    <span
                                        className="text-xl font-bold tracking-wider uppercase block mb-1"
                                        style={{
                                            color: isPowered ? "#FFD700" : "#888",
                                            textShadow: isPowered ? "0 0 20px rgba(255,215,0,0.6)" : "none",
                                            transition: "all 0.3s ease"
                                        }}
                                    >
                                        {branch}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Skill labels */}
                        {skills.map((skill) => {
                            const centerX = canvasSize.width / 2;
                            const startY = 80;
                            const endY = canvasSize.height - 50;
                            const totalHeight = endY - startY;
                            const nodeY = startY + totalHeight * skill.position;
                            const branchLength = 150;
                            const isLeft = skill.branch === "frontend" || skill.branch === "database";
                            const branchEndX = isLeft ? centerX - branchLength : centerX + branchLength;
                            const isPowered = isSkillPowered(skill);
                            const intensity = isPowered ? 1 : 0;

                            return (
                                <div
                                    key={skill.id}
                                    className="absolute pointer-events-none"
                                    style={{
                                        left: isLeft ? `${branchEndX - 180}px` : `${branchEndX + 25}px`,
                                        top: `${nodeY - 10}px`,
                                        textAlign: isLeft ? "right" : "left",
                                        width: "150px"
                                    }}
                                >
                                    <span
                                        className="text-base font-semibold"
                                        style={{
                                            color: isPowered ? `rgba(255, 240, 180, ${0.95 * intensity})` : "#888",
                                            textShadow: isPowered ? `0 0 ${15 * intensity}px rgba(255,255,150,${intensity * 0.6})` : "none",
                                            transition: "all 0.3s ease"
                                        }}
                                    >
                                        {skill.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div
                    className="text-center text-xs tracking-[0.35em] uppercase mt-6"
                    style={{
                        color: scrollProgress < 0.95 ? "#555" : "#222",
                        transition: "all 0.5s ease"
                    }}
                >
                    Scroll to energize skill tree
                </div>
            </div>
        </section>
    );
}