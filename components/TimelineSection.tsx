"use client";

import { useEffect, useRef, useState } from "react";

export default function CircuitTimeline() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 900 });

    // Track switch states manually
    const switchStatesRef = useRef<boolean[]>([true, true, true, true, true]);
    const [renderTrigger, setRenderTrigger] = useState(0);

    const milestones = [
        {
            id: 1,
            year: "2002",
            title: "Born",
            location: "Indore",
            date: "11-12-2002",
            x: 0.15,
            y: 0.08,
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

    const createCircuitPath = () => {
        const points: { x: number; y: number }[] = [];
        const w = canvasSize.width;
        const h = canvasSize.height;

        const m1 = { x: milestones[0].x * w, y: milestones[0].y * h };
        points.push(m1);
        points.push({ x: m1.x, y: milestones[1].y * h });

        const m2 = { x: milestones[1].x * w, y: milestones[1].y * h };
        points.push(m2);
        points.push({ x: m2.x, y: milestones[2].y * h });

        const m3 = { x: milestones[2].x * w, y: milestones[2].y * h };
        points.push(m3);

        const m4Y = milestones[3].y * h;
        points.push({ x: m3.x, y: m4Y });
        const m4 = { x: milestones[3].x * w, y: m4Y };
        points.push(m4);

        const m5Y = milestones[4].y * h;
        points.push({ x: m4.x, y: m5Y });
        const m5 = { x: milestones[4].x * w, y: m5Y };
        points.push(m5);

        const m6Y = milestones[5].y * h;
        points.push({ x: m5.x, y: m6Y });
        const m6 = { x: milestones[5].x * w, y: m6Y };
        points.push(m6);

        return points;
    };

    // Calculate switch positions (midpoints between milestones)
    const getSwitchPositions = () => {
        const switches = [];
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

        const milestonePositions: number[] = [];
        for (let m = 0; m < milestones.length; m++) {
            const mx = milestones[m].x * canvasSize.width;
            const my = milestones[m].y * canvasSize.height;

            let accLength = 0;
            for (let i = 0; i < pathPoints.length; i++) {
                const dx = Math.abs(pathPoints[i].x - mx);
                const dy = Math.abs(pathPoints[i].y - my);
                if (dx < 10 && dy < 10) {
                    for (let j = 0; j < i && j < segmentLengths.length; j++) {
                        accLength += segmentLengths[j];
                    }
                    milestonePositions.push(accLength / totalLength);
                    break;
                }
            }
        }

        for (let i = 0; i < milestonePositions.length - 1; i++) {
            const midProgress = (milestonePositions[i] + milestonePositions[i + 1]) / 2;

            let accLength = 0;
            const targetLength = midProgress * totalLength;
            let switchX = pathPoints[0].x;
            let switchY = pathPoints[0].y;

            for (let j = 0; j < segmentLengths.length; j++) {
                if (accLength + segmentLengths[j] >= targetLength) {
                    const segProgress = (targetLength - accLength) / segmentLengths[j];
                    switchX = pathPoints[j].x + (pathPoints[j + 1].x - pathPoints[j].x) * segProgress;
                    switchY = pathPoints[j].y + (pathPoints[j + 1].y - pathPoints[j].y) * segProgress;
                    break;
                }
                accLength += segmentLengths[j];
            }

            switches.push({
                id: i,
                x: switchX,
                y: switchY,
                progress: midProgress
            });
        }

        return switches;
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

        const handleCanvasClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = (e.clientX - rect.left) * (parseInt(canvas.style.width) / rect.width);
            const clickY = (e.clientY - rect.top) * (parseInt(canvas.style.height) / rect.height);

            const switches = getSwitchPositions();
            switches.forEach((sw) => {
                const dx = clickX - sw.x;
                const dy = clickY - sw.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= 30) {
                    switchStatesRef.current[sw.id] = !switchStatesRef.current[sw.id];
                    setRenderTrigger(prev => prev + 1);
                }
            });
        };

        canvas.addEventListener('click', handleCanvasClick);
        canvas.style.cursor = 'pointer';

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

            const switches = getSwitchPositions();

            // Find first disabled switch and the node before it
            let firstDisabledSwitchProgress = 1;
            let stopAtNodeProgress = 1;

            for (let i = 0; i < switches.length; i++) {
                if (!switchStatesRef.current[i]) {
                    firstDisabledSwitchProgress = switches[i].progress;

                    // Find the milestone that comes before this switch
                    for (let m = milestones.length - 1; m >= 0; m--) {
                        const mx = milestones[m].x * canvasSize.width;
                        const my = milestones[m].y * canvasSize.height;

                        let milestoneLength = 0;
                        for (let p = 0; p < pathPoints.length; p++) {
                            const dx = Math.abs(pathPoints[p].x - mx);
                            const dy = Math.abs(pathPoints[p].y - my);
                            if (dx < 10 && dy < 10) {
                                for (let j = 0; j < p && j < segmentLengths.length; j++) {
                                    milestoneLength += segmentLengths[j];
                                }
                                const milestoneProgress = milestoneLength / totalLength;

                                if (milestoneProgress < firstDisabledSwitchProgress) {
                                    stopAtNodeProgress = milestoneProgress;
                                    break;
                                }
                            }
                        }
                        if (stopAtNodeProgress < 1) break;
                    }
                    break;
                }
            }

            const effectiveProgress = Math.min(scrollProgress, stopAtNodeProgress);
            const currentLength = effectiveProgress * totalLength;

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

            // Draw path segments with gaps at OFF switches
            ctx.lineWidth = 5;

            // First, draw all inactive segments
            for (let i = 0; i < pathPoints.length - 1; i++) {
                let segStart = 0;
                for (let j = 0; j < i; j++) {
                    segStart += segmentLengths[j];
                }
                const segEnd = segStart + segmentLengths[i];
                const segProgress = segStart / totalLength;

                // Check if this segment should have a gap (if there's an OFF switch on it)
                let hasOffSwitch = false;
                let gapStart = 0;
                let gapEnd = 0;

                for (let s = 0; s < switches.length; s++) {
                    if (!switchStatesRef.current[s]) {
                        const swPos = switches[s].progress * totalLength;
                        if (swPos >= segStart && swPos <= segEnd) {
                            hasOffSwitch = true;
                            const localProgress = (swPos - segStart) / segmentLengths[i];
                            const gapSize = 25; // pixels
                            gapStart = localProgress - (gapSize / 2) / segmentLengths[i];
                            gapEnd = localProgress + (gapSize / 2) / segmentLengths[i];
                            break;
                        }
                    }
                }

                if (hasOffSwitch) {
                    // Draw segment before gap
                    if (gapStart > 0) {
                        ctx.beginPath();
                        ctx.strokeStyle = "#888";
                        ctx.moveTo(pathPoints[i].x, pathPoints[i].y);
                        const gapX1 = pathPoints[i].x + (pathPoints[i + 1].x - pathPoints[i].x) * gapStart;
                        const gapY1 = pathPoints[i].y + (pathPoints[i + 1].y - pathPoints[i].y) * gapStart;
                        ctx.lineTo(gapX1, gapY1);
                        ctx.stroke();
                    }

                    // Draw segment after gap
                    if (gapEnd < 1) {
                        ctx.beginPath();
                        ctx.strokeStyle = "#888";
                        const gapX2 = pathPoints[i].x + (pathPoints[i + 1].x - pathPoints[i].x) * gapEnd;
                        const gapY2 = pathPoints[i].y + (pathPoints[i + 1].y - pathPoints[i].y) * gapEnd;
                        ctx.moveTo(gapX2, gapY2);
                        ctx.lineTo(pathPoints[i + 1].x, pathPoints[i + 1].y);
                        ctx.stroke();
                    }
                } else {
                    // Draw full segment
                    ctx.beginPath();
                    ctx.strokeStyle = "#888";
                    ctx.moveTo(pathPoints[i].x, pathPoints[i].y);
                    ctx.lineTo(pathPoints[i + 1].x, pathPoints[i + 1].y);
                    ctx.stroke();
                }
            }

            // Draw activated path with glow (stops at OFF switches)
            if (effectiveProgress > 0) {
                ctx.strokeStyle = "#FFD700";
                ctx.lineWidth = 5;
                ctx.shadowBlur = 30;
                ctx.shadowColor = "rgba(255, 215, 0, 0.9)";

                let drawLength = 0;
                for (let i = 0; i < segmentLengths.length; i++) {
                    let segStart = 0;
                    for (let j = 0; j < i; j++) {
                        segStart += segmentLengths[j];
                    }
                    const segEnd = segStart + segmentLengths[i];

                    // Check for OFF switch on this segment
                    let switchOnSegment = -1;
                    for (let s = 0; s < switches.length; s++) {
                        if (!switchStatesRef.current[s]) {
                            const swPos = switches[s].progress * totalLength;
                            if (swPos >= segStart && swPos <= segEnd) {
                                switchOnSegment = s;
                                break;
                            }
                        }
                    }

                    if (switchOnSegment !== -1 && drawLength < currentLength) {
                        // Draw up to the switch, then stop
                        const swPos = switches[switchOnSegment].progress * totalLength;
                        const drawToSwitch = Math.min(currentLength, swPos - 12.5);

                        if (drawToSwitch > drawLength) {
                            ctx.beginPath();
                            ctx.moveTo(pathPoints[i].x, pathPoints[i].y);

                            const localProgress = (drawToSwitch - segStart) / segmentLengths[i];
                            const x = pathPoints[i].x + (pathPoints[i + 1].x - pathPoints[i].x) * localProgress;
                            const y = pathPoints[i].y + (pathPoints[i + 1].y - pathPoints[i].y) * localProgress;
                            ctx.lineTo(x, y);
                            ctx.stroke();
                        }
                        break;
                    } else if (drawLength + segmentLengths[i] <= currentLength) {
                        ctx.beginPath();
                        ctx.moveTo(pathPoints[i].x, pathPoints[i].y);
                        ctx.lineTo(pathPoints[i + 1].x, pathPoints[i + 1].y);
                        ctx.stroke();
                        drawLength += segmentLengths[i];
                    } else {
                        ctx.beginPath();
                        const segmentProgress = (currentLength - drawLength) / segmentLengths[i];
                        const x = pathPoints[i].x + (pathPoints[i + 1].x - pathPoints[i].x) * segmentProgress;
                        const y = pathPoints[i].y + (pathPoints[i + 1].y - pathPoints[i].y) * segmentProgress;
                        ctx.moveTo(pathPoints[i].x, pathPoints[i].y);
                        ctx.lineTo(x, y);
                        ctx.stroke();
                        break;
                    }
                }

                ctx.shadowBlur = 0;
            }

            // Draw switches - circuit diagram style with proper wire thickness
            switches.forEach((sw) => {
                const isOn = switchStatesRef.current[sw.id];
                const circleRadius = 8;
                const lineLength = 20;

                // Left circle (hollow)
                ctx.beginPath();
                ctx.arc(sw.x - lineLength, sw.y, circleRadius, 0, Math.PI * 2);
                ctx.strokeStyle = "#888";
                ctx.lineWidth = 3;
                ctx.fillStyle = "#000";
                ctx.fill();
                ctx.stroke();

                // Right circle (hollow)
                ctx.beginPath();
                ctx.arc(sw.x + lineLength, sw.y, circleRadius, 0, Math.PI * 2);
                ctx.strokeStyle = "#888";
                ctx.lineWidth = 3;
                ctx.fillStyle = "#000";
                ctx.fill();
                ctx.stroke();

                // Switch lever line - same thickness as wire (5px)
                if (isOn) {
                    // Horizontal line when ON - matches wire thickness
                    ctx.beginPath();
                    ctx.strokeStyle = "#888";
                    ctx.lineWidth = 5;
                    ctx.moveTo(sw.x - lineLength, sw.y);
                    ctx.lineTo(sw.x + lineLength, sw.y);
                    ctx.stroke();
                } else {
                    // Angled line when OFF - showing gap/disconnection
                    ctx.beginPath();
                    ctx.strokeStyle = "#888";
                    ctx.lineWidth = 5;
                    ctx.moveTo(sw.x - lineLength, sw.y);
                    ctx.lineTo(sw.x + lineLength - 8, sw.y - 18);
                    ctx.stroke();
                }
            });

            // Draw nodes with bulb-like glow
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

                const nodeRadius = 18;

                if (milestoneReached) {
                    const pulseTime = Date.now() / 1000;
                    const pulse = Math.sin(pulseTime * 2 + index) * 0.15 + 0.85;

                    // Large outer glow
                    const glowRadius = nodeRadius * 8;
                    const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
                    gradient.addColorStop(0, `rgba(255, 240, 150, ${pulse * 0.5})`);
                    gradient.addColorStop(0.2, `rgba(255, 220, 120, ${pulse * 0.4})`);
                    gradient.addColorStop(0.5, `rgba(255, 200, 100, ${pulse * 0.25})`);
                    gradient.addColorStop(0.8, `rgba(255, 180, 80, ${pulse * 0.1})`);
                    gradient.addColorStop(1, `rgba(255, 160, 60, 0)`);

                    ctx.beginPath();
                    ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }

                // Main node circle
                ctx.beginPath();
                ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);

                if (milestoneReached) {
                    const pulseTime = Date.now() / 1000;
                    const pulse = Math.sin(pulseTime * 2 + index) * 0.2 + 0.8;

                    const bulbGradient = ctx.createRadialGradient(x, y, 0, x, y, nodeRadius);
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
                    const inactiveGradient = ctx.createRadialGradient(x, y, 0, x, y, nodeRadius);
                    inactiveGradient.addColorStop(0, `rgba(200, 200, 200, 0.3)`);
                    inactiveGradient.addColorStop(0.7, `rgba(150, 150, 150, 0.4)`);
                    inactiveGradient.addColorStop(1, `rgba(100, 100, 100, 0.5)`);
                    ctx.fillStyle = inactiveGradient;
                    ctx.fill();
                    ctx.strokeStyle = "#666";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }

                ctx.strokeStyle = milestoneReached ? "rgba(255, 215, 0, 0.4)" : "rgba(128, 128, 128, 0.4)";
                ctx.lineWidth = 1;
                ctx.strokeRect(x - 12, y - 12, 24, 24);
            });

            // Energy particle
            if (effectiveProgress > 0 && effectiveProgress < 1) {
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
            canvas.removeEventListener('click', handleCanvasClick);
            cancelAnimationFrame(animationFrame);
        };
    }, [scrollProgress, canvasSize.width, canvasSize.height, renderTrigger]);

    // Calculate if milestone should be active based on switches
    const isMilestoneActive = (index: number) => {
        const switches = getSwitchPositions();
        const milestoneProgress = index / (milestones.length - 1);

        // Check if any switch before this milestone is off
        for (let i = 0; i < switches.length; i++) {
            if (switches[i].progress < milestoneProgress * 0.95) {
                if (!switchStatesRef.current[i]) {
                    return false;
                }
            }
        }

        return scrollProgress >= milestoneProgress * 0.95;
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-black"
            style={{ height: "300vh" }}
        >
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center py-8">
                <h2
                    className="text-center text-5xl md:text-6xl font-bold mb-12 tracking-[0.25em] uppercase"
                    style={{
                        color: scrollProgress > 0.05 ? "#FFD700" : "#888",
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
                            const isActive = isMilestoneActive(index);
                            const intensity = isActive ? 1 : 0;

                            let textLeft = milestone.x * canvasSize.width;

                            if (milestone.x < 0.4) {
                                textLeft = textLeft - 260;
                            } else {
                                textLeft = textLeft + 50;
                            }

                            return (
                                <div
                                    key={milestone.id}
                                    className="absolute pointer-events-none"
                                    style={{
                                        left: `${textLeft}px`,
                                        top: `${milestone.y * canvasSize.height - 25}px`,
                                        // opacity: isActive ? 1 : 0.3,
                                        transition: "opacity 0.4s ease",
                                        width: "240px"
                                    }}
                                >
                                    <div className="flex flex-col">
                                        <span
                                            className="text-xl font-bold tracking-wider mb-1"
                                            style={{
                                                color: isActive ? `rgba(255, 215, 0, ${intensity})` : "#888",
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
                                                color: isActive ? `rgba(255, 240, 180, ${0.95 * intensity})` : "#888",
                                                transition: "all 0.3s ease",
                                                lineHeight: "1.3"
                                            }}
                                        >
                                            {milestone.title}
                                        </span>
                                        <span
                                            className="text-sm"
                                            style={{
                                                color: isActive ? `rgba(180, 180, 180, ${0.85 + intensity * 0.15})` : "#888",
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
                                                    color: isActive ? `rgba(150, 150, 150, ${0.75 + intensity * 0.25})` : "#888",
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
                    className="text-center text-xs tracking-[0.35em] uppercase mt-6"
                    style={{
                        color: scrollProgress < 0.95 ? "#555" : "#222",
                        //opacity: scrollProgress < 0.95 ? 0.7 : 0,
                        transition: "all 0.5s ease",
                        fontFamily: "system-ui, -apple-system, sans-serif"
                    }}
                >
                    {/* Scroll to energize • Click switches to control circuit */}
                </div>
            </div>
        </section>
    );
}