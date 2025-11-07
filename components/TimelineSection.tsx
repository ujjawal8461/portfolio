"use client";

import { useEffect, useRef, useState } from "react";

export default function CircuitTimeline() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 900 });

    const milestones = [
        {
            id: 1,
            year: "2002",
            title: "Born",
            location: "Indore",
            date: "11-12-2002",
            x: 0.15,
            y: 0.08
        },
        {
            id: 2,
            year: "2018",
            title: "10th Grade",
            location: "Sarafa Vidya Niketan",
            x: 0.5,
            y: 0.22
        },
        {
            id: 3,
            year: "2020",
            title: "12th Grade",
            location: "Sarafa Vidya Niketan",
            x: 0.85,
            y: 0.36
        },
        {
            id: 4,
            year: "2020-2024",
            title: "B.Tech Computer Science",
            location: "CDGI, Indore",
            x: 0.2,
            y: 0.54
        },
        {
            id: 5,
            year: "2022",
            title: "Web Developer Intern",
            location: "Physics Wallah",
            x: 0.65,
            y: 0.7
        },
        {
            id: 6,
            year: "2024",
            title: "Junior Developer",
            location: "Dexbytes Infotech",
            x: 0.85,
            y: 0.88
        }
    ];

    // Create complex circuit path matching the ASCII diagram
    const createCircuitPath = () => {
        const points: { x: number; y: number }[] = [];
        const w = canvasSize.width;
        const h = canvasSize.height;

        // Start at milestone 1 (Born)
        const m1 = { x: milestones[0].x * w, y: milestones[0].y * h };
        points.push(m1);

        // Go down to milestone 2 level
        points.push({ x: m1.x, y: milestones[1].y * h });

        // Go right to milestone 2 (10th)
        const m2 = { x: milestones[1].x * w, y: milestones[1].y * h };
        points.push(m2);

        // Go down a bit then right to milestone 3 (12th)
        points.push({ x: m2.x, y: milestones[2].y * h });
        const m3 = { x: milestones[2].x * w, y: milestones[2].y * h };
        points.push(m3);

        // Go down and then LEFT to milestone 4 (B.Tech) - this creates the backwards flow
        const m4Y = milestones[3].y * h;
        points.push({ x: m3.x, y: m4Y });
        const m4 = { x: milestones[3].x * w, y: m4Y };
        points.push(m4);

        // From B.Tech, go down and then RIGHT to milestone 5 (Intern)
        const m5Y = milestones[4].y * h;
        points.push({ x: m4.x, y: m5Y });
        const m5 = { x: milestones[4].x * w, y: m5Y };
        points.push(m5);

        // From Intern, go down and then RIGHT to milestone 6 (Junior Dev)
        const m6Y = milestones[5].y * h;
        points.push({ x: m5.x, y: m6Y });
        const m6 = { x: milestones[5].x * w, y: m6Y };
        points.push(m6);

        return points;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const section = sectionRef.current;
        if (!canvas || !section) return;

        const ctx = canvas.getContext("2d")!;
        const dpr = window.devicePixelRatio || 1;

        const resizeCanvas = () => {
            const width = Math.min(window.innerWidth * 0.9, 1400);
            const height = Math.min(window.innerHeight * 0.8, 1000);

            setCanvasSize({ width, height });

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        };

        resizeCanvas();

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
        window.addEventListener("resize", resizeCanvas);

        let animationFrame: number;

        const animate = () => {
            const width = parseInt(canvas.style.width);
            const height = parseInt(canvas.style.height);

            ctx.clearRect(0, 0, width, height);

            const pathPoints = createCircuitPath();

            let totalLength = 0;
            const segmentLengths: number[] = [];
            for (let i = 1; i < pathPoints.length; i++) {
                const dx = pathPoints[i].x - pathPoints[i - 1].x;
                const dy = pathPoints[i].y - pathPoints[i - 1].y;
                const length = Math.sqrt(dx * dx + dy * dy);
                segmentLengths.push(length);
                totalLength += length;
            }

            const currentLength = scrollProgress * totalLength;
            let accumulatedLength = 0;
            let particleX = pathPoints[0].x;
            let particleY = pathPoints[0].y;

            for (let i = 0; i < segmentLengths.length; i++) {
                if (accumulatedLength + segmentLengths[i] >= currentLength) {
                    const segmentProgress = (currentLength - accumulatedLength) / segmentLengths[i];
                    particleX = pathPoints[i].x + (pathPoints[i + 1].x - pathPoints[i].x) * segmentProgress;
                    particleY = pathPoints[i].y + (pathPoints[i + 1].y - pathPoints[i].y) * segmentProgress;
                    break;
                }
                accumulatedLength += segmentLengths[i];
            }

            // Draw inactive path - matching HeroSection gray
            ctx.beginPath();
            ctx.strokeStyle = "rgba(128, 128, 128, 0.5)";
            ctx.lineWidth = 5;
            pathPoints.forEach((point, i) => {
                if (i === 0) ctx.moveTo(point.x, point.y);
                else ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();

            // Draw activated path with glow
            if (scrollProgress > 0) {
                ctx.beginPath();
                ctx.strokeStyle = "#FFD700";
                ctx.lineWidth = 5;
                ctx.shadowBlur = 30;
                ctx.shadowColor = "rgba(255, 215, 0, 0.9)";

                ctx.moveTo(pathPoints[0].x, pathPoints[0].y);

                let drawLength = 0;
                for (let i = 0; i < segmentLengths.length; i++) {
                    if (drawLength + segmentLengths[i] <= currentLength) {
                        ctx.lineTo(pathPoints[i + 1].x, pathPoints[i + 1].y);
                        drawLength += segmentLengths[i];
                    } else {
                        const segmentProgress = (currentLength - drawLength) / segmentLengths[i];
                        const x = pathPoints[i].x + (pathPoints[i + 1].x - pathPoints[i].x) * segmentProgress;
                        const y = pathPoints[i].y + (pathPoints[i + 1].y - pathPoints[i].y) * segmentProgress;
                        ctx.lineTo(x, y);
                        break;
                    }
                }

                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            // Draw nodes
            milestones.forEach((milestone, index) => {
                const x = milestone.x * canvasSize.width;
                const y = milestone.y * canvasSize.height;

                let milestoneReached = false;
                let milestoneLength = 0;

                for (let i = 0; i < pathPoints.length; i++) {
                    const dx = Math.abs(pathPoints[i].x - x);
                    const dy = Math.abs(pathPoints[i].y - y);
                    if (dx < 10 && dy < 10) {
                        for (let j = 0; j < i; j++) {
                            if (j < segmentLengths.length) {
                                milestoneLength += segmentLengths[j];
                            }
                        }
                        milestoneReached = currentLength >= milestoneLength;
                        break;
                    }
                }

                if (milestoneReached) {
                    const pulseTime = Date.now() / 1000;
                    const pulse = Math.sin(pulseTime * 2 + index) * 0.2 + 0.8;

                    // Outer glow rings with higher opacity
                    ctx.beginPath();
                    ctx.arc(x, y, 26, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(255, 215, 0, ${0.4 * pulse})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.arc(x, y, 38, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(255, 215, 0, ${0.25 * pulse})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                ctx.beginPath();
                ctx.arc(x, y, 18, 0, Math.PI * 2);

                if (milestoneReached) {
                    const pulseTime = Date.now() / 1000;
                    const pulse = Math.sin(pulseTime * 2 + index) * 0.2 + 0.8;

                    ctx.shadowBlur = 40 * pulse;
                    ctx.shadowColor = "rgba(255, 215, 0, 0.9)";

                    const gradient = ctx.createRadialGradient(x - 4, y - 4, 0, x, y, 18);
                    gradient.addColorStop(0, "#FFF");
                    gradient.addColorStop(0.4, "#FFD700");
                    gradient.addColorStop(1, "#FFA500");
                    ctx.fillStyle = gradient;
                    ctx.fill();

                    ctx.strokeStyle = "#FFF";
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                } else {
                    // Inactive node - matching HeroSection gray
                    ctx.fillStyle = "rgba(128, 128, 128, 0.5)";
                    ctx.fill();
                    ctx.strokeStyle = "rgba(100, 100, 100, 0.5)";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }

                ctx.strokeStyle = milestoneReached ? "rgba(255, 215, 0, 0.4)" : "rgba(128, 128, 128, 0.4)";
                ctx.lineWidth = 1;
                ctx.strokeRect(x - 12, y - 12, 24, 24);
            });

            // Energy particle with enhanced glow
            if (scrollProgress > 0 && scrollProgress < 1) {
                const gradient = ctx.createRadialGradient(particleX, particleY, 0, particleX, particleY, 50);
                gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
                gradient.addColorStop(0.3, "rgba(255, 215, 0, 0.9)");
                gradient.addColorStop(0.7, "rgba(255, 180, 0, 0.5)");
                gradient.addColorStop(1, "rgba(255, 160, 60, 0)");

                ctx.beginPath();
                ctx.arc(particleX, particleY, 50, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(particleX, particleY, 10, 0, Math.PI * 2);
                ctx.fillStyle = "#FFF";
                ctx.shadowBlur = 35;
                ctx.shadowColor = "rgba(255, 215, 0, 0.9)";
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrame);
        };
    }, [scrollProgress, canvasSize.width, canvasSize.height]);

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-black"
            style={{ height: "300vh" }}
        >
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center py-8">
                <h2
                    className="text-center text-5xl md:text-6xl font-bold mb-8 tracking-[0.25em] uppercase"
                    style={{
                        color: scrollProgress > 0.05 ? "#FFD700" : "rgba(128, 128, 128, 0.5)",
                        textShadow: scrollProgress > 0.05 ? "0 0 50px rgba(255,215,0,0.5)" : "none",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        fontFamily: "system-ui, -apple-system, sans-serif"
                    }}
                >
                    TIME LINE CIRCUIT
                </h2>

                <div className="relative flex justify-center items-center flex-1 w-full">
                    <div className="relative">
                        <canvas ref={canvasRef} />

                        {milestones.map((milestone, index) => {
                            const milestoneProgress = index / (milestones.length - 1);
                            const isActive = scrollProgress >= milestoneProgress * 0.95;
                            const intensity = isActive ? Math.min(1, (scrollProgress - milestoneProgress * 0.95) * 10) : 0;

                            // Position text based on milestone location
                            let textLeft = milestone.x * canvasSize.width;
                            let textOffset = 50;

                            // Adjust positioning for specific milestones to avoid overlap
                            if (milestone.x < 0.4) {
                                textLeft = textLeft - 260; // Left side
                            } else {
                                textLeft = textLeft + textOffset; // Right side
                            }

                            return (
                                <div
                                    key={milestone.id}
                                    className="absolute pointer-events-none"
                                    style={{
                                        left: `${textLeft}px`,
                                        top: `${milestone.y * canvasSize.height - 25}px`,
                                        opacity: isActive ? 1 : 0.3,
                                        transition: "opacity 0.4s ease",
                                        width: "240px"
                                    }}
                                >
                                    <div className="flex flex-col">
                                        <span
                                            className="text-xl font-bold tracking-wider mb-1"
                                            style={{
                                                color: isActive ? `rgba(255, 215, 0, ${intensity})` : "rgba(128, 128, 128, 0.5)",
                                                textShadow: isActive ? `0 0 ${20 * intensity}px rgba(255,255,150,${intensity * 0.6}), 0 0 ${40 * intensity}px rgba(255,255,150,${intensity * 0.7})` : "none",
                                                fontFamily: "system-ui, -apple-system, sans-serif",
                                                transition: "all 0.3s ease"
                                            }}
                                        >
                                            {milestone.year}
                                        </span>
                                        <span
                                            className="text-base font-semibold mb-1"
                                            style={{
                                                color: isActive ? `rgba(255, 240, 180, ${0.95 * intensity})` : "rgba(100, 100, 100, 0.4)",
                                                transition: "all 0.3s ease",
                                                lineHeight: "1.3"
                                            }}
                                        >
                                            {milestone.title}
                                        </span>
                                        <span
                                            className="text-sm"
                                            style={{
                                                color: isActive ? `rgba(180, 180, 180, ${0.85 + intensity * 0.15})` : "rgba(80, 80, 80, 0.4)",
                                                transition: "all 0.3s ease",
                                                lineHeight: "1.4"
                                            }}
                                        >
                                            {milestone.location}
                                        </span>
                                        {milestone.date && (
                                            <span
                                                className="text-xs mt-1"
                                                style={{
                                                    color: isActive ? `rgba(150, 150, 150, ${0.75 + intensity * 0.25})` : "rgba(70, 70, 70, 0.4)",
                                                    transition: "all 0.3s ease"
                                                }}
                                            >
                                                {milestone.date}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div
                    className="text-center text-xs tracking-[0.35em] uppercase mt-4"
                    style={{
                        color: scrollProgress < 0.95 ? "#555" : "#222",
                        opacity: scrollProgress < 0.95 ? 0.7 : 0,
                        transition: "all 0.5s ease",
                        fontFamily: "system-ui, -apple-system, sans-serif"
                    }}
                >
                    Scroll to energize the circuit
                </div>
            </div>
        </section>
    );
}