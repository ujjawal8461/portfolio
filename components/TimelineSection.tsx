"use client";

import { useEffect, useRef, useState } from "react";

export default function CircuitTimeline() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 900 });
    const [isMobile, setIsMobile] = useState(false);

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
            year: "Sep 2022 - Nov 2022",
            title: "Web Developer Intern",
            location: "Physics Wallah",
            x: 0.65,
            y: 0.7
        },
        {
            id: 6,
            year: "July 2024 - Present",
            title: "Junior Developer",
            location: "Dexbytes Infotech",
            x: 0.85,
            y: 0.88
        }
    ];

    // Padding scales with screen so circuit never clips on any device
    const getPad = (w: number, h: number) => ({
        x: w < 640 ? Math.max(30, w * 0.08) : Math.max(80, w * 0.1),
        y: h < 700 ? Math.max(30, h * 0.08) : Math.max(60, h * 0.1),
    });

    // computeMapX/Y: explicit w/h required — used everywhere inside effect to avoid stale state
    const computeMapX = (x: number, w: number) => {
        const pad = getPad(w, 0);
        return pad.x + x * (w - pad.x * 2);
    };
    const computeMapY = (y: number, h: number) => {
        const pad = getPad(0, h);
        return pad.y + y * (h - pad.y * 2);
    };

    // mapX/mapY: uses canvasSize state — only used in React render (JSX), never inside useEffect
    const mapX = (x: number) => {
        const pad = getPad(canvasSize.width, canvasSize.height);
        return pad.x + x * (canvasSize.width - pad.x * 2);
    };
    const mapY = (y: number) => {
        const pad = getPad(canvasSize.width, canvasSize.height);
        return pad.y + y * (canvasSize.height - pad.y * 2);
    };

    // Mobile: nodes alternate left-right in a clean zigzag
    // Even indices (0,2,4) = left side, Odd indices (1,3,5) = right side
    const getMobileNodeX = (index: number) => index % 2 === 0 ? 0.12 : 0.88;
    const getMobileNodeY = (index: number) => 0.06 + index * 0.17; // evenly spaced top→bottom

    // All path/switch functions require explicit w/h — no closures over canvasSize
    const createCircuitPath = (w: number, h: number) => {
        const points: { x: number; y: number }[] = [];
        const mobile = w < 640;

        if (mobile) {
            // Mobile: clean zigzag — horizontal wire then vertical drop, alternating sides
            for (let i = 0; i < milestones.length; i++) {
                const nx = computeMapX(getMobileNodeX(i), w);
                const ny = computeMapY(getMobileNodeY(i), h);
                points.push({ x: nx, y: ny });
                if (i < milestones.length - 1) {
                    const nextNx = computeMapX(getMobileNodeX(i + 1), w);
                    const nextNy = computeMapY(getMobileNodeY(i + 1), h);
                    // go horizontal first, then vertical
                    points.push({ x: nextNx, y: ny });
                    points.push({ x: nextNx, y: nextNy });
                }
            }
        } else {
            // Desktop: original zigzag path
            const m1 = { x: computeMapX(milestones[0].x, w), y: computeMapY(milestones[0].y, h) };
            points.push(m1);
            points.push({ x: m1.x, y: computeMapY(milestones[1].y, h) });

            const m2 = { x: computeMapX(milestones[1].x, w), y: computeMapY(milestones[1].y, h) };
            points.push(m2);
            points.push({ x: m2.x, y: computeMapY(milestones[2].y, h) });

            const m3 = { x: computeMapX(milestones[2].x, w), y: computeMapY(milestones[2].y, h) };
            points.push(m3);

            const m4Y = computeMapY(milestones[3].y, h);
            points.push({ x: m3.x, y: m4Y });
            const m4 = { x: computeMapX(milestones[3].x, w), y: m4Y };
            points.push(m4);

            const m5Y = computeMapY(milestones[4].y, h);
            points.push({ x: m4.x, y: m5Y });
            const m5 = { x: computeMapX(milestones[4].x, w), y: m5Y };
            points.push(m5);

            const m6Y = computeMapY(milestones[5].y, h);
            points.push({ x: m5.x, y: m6Y });
            const m6 = { x: computeMapX(milestones[5].x, w), y: m6Y };
            points.push(m6);
        }

        return points;
    };

    // getSwitchPositions requires explicit w/h — uses computeMapX/Y consistently
    const getSwitchPositions = (w: number, h: number) => {
        const switches = [];
        const pathPoints = createCircuitPath(w, h);
        const mobile = w < 640;

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
            const mx = mobile
                ? computeMapX(getMobileNodeX(m), w)
                : computeMapX(milestones[m].x, w);
            const my = mobile
                ? computeMapY(getMobileNodeY(m), h)
                : computeMapY(milestones[m].y, h);

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
            const width = document.documentElement.clientWidth || window.innerWidth;
            const height = window.innerHeight;

            setCanvasSize(prev => {
                if (prev.width === width && prev.height === height) return prev;
                return { width, height };
            });
            setIsMobile(prev => prev === (width < 640) ? prev : (width < 640));

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

            // On mobile, the URL bar hiding/showing changes innerHeight without always firing resize
            // We must update the canvas size dynamically if it doesn't match windowHeight
            if (canvas && parseInt(canvas.style.height) !== windowHeight && !isNaN(parseInt(canvas.style.height))) {
                resizeCanvas();
            }

            if (rect.top <= 0 && rect.bottom > windowHeight) {
                const scrolledPastTop = -rect.top;
                const sectionScrollHeight = rect.height - windowHeight;
                const progress = Math.max(0, Math.min(1, scrolledPastTop / sectionScrollHeight));
                setScrollProgress(prev => Math.abs(prev - progress) < 0.0001 ? prev : progress);
            } else if (rect.top > 0) {
                setScrollProgress(prev => prev === 0 ? prev : 0);
            } else if (rect.bottom <= windowHeight) {
                setScrollProgress(prev => prev === 1 ? prev : 1);
            }
        };

        const handleCanvasClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const liveW = parseInt(canvas.style.width);
            const liveH = parseInt(canvas.style.height);
            const clickX = (e.clientX - rect.left) * (liveW / rect.width);
            const clickY = (e.clientY - rect.top) * (liveH / rect.height);

            const switches = getSwitchPositions(liveW, liveH);

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

        const handleCanvasTouch = (e: TouchEvent) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const rect = canvas.getBoundingClientRect();
            const liveW = parseInt(canvas.style.width);
            const liveH = parseInt(canvas.style.height);
            const touchX = (touch.clientX - rect.left) * (liveW / rect.width);
            const touchY = (touch.clientY - rect.top) * (liveH / rect.height);
            const switches = getSwitchPositions(liveW, liveH);
            switches.forEach((sw) => {
                const dx = touchX - sw.x;
                const dy = touchY - sw.y;
                if (Math.sqrt(dx * dx + dy * dy) <= 44) {
                    switchStatesRef.current[sw.id] = !switchStatesRef.current[sw.id];
                    setRenderTrigger(prev => prev + 1);
                }
            });
        };

        canvas.addEventListener('touchend', handleCanvasTouch, { passive: false });
        canvas.style.cursor = 'pointer';

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", resizeCanvas);

        let animationFrame: number;

        const animate = () => {
            // Read live dimensions from canvas — never use stale canvasSize state
            const width = parseInt(canvas.style.width);
            const height = parseInt(canvas.style.height);

            ctx.clearRect(0, 0, width, height);

            const pathPoints = createCircuitPath(width, height);

            let totalLength = 0;
            const segmentLengths: number[] = [];
            for (let i = 1; i < pathPoints.length; i++) {
                const dx = pathPoints[i].x - pathPoints[i - 1].x;
                const dy = pathPoints[i].y - pathPoints[i - 1].y;
                const length = Math.sqrt(dx * dx + dy * dy);
                segmentLengths.push(length);
                totalLength += length;
            }

            const switches = getSwitchPositions(width, height);

            // Find first disabled switch and the node before it
            let firstDisabledSwitchProgress = 1;
            let stopAtNodeProgress = 1;

            for (let i = 0; i < switches.length; i++) {
                if (!switchStatesRef.current[i]) {
                    firstDisabledSwitchProgress = switches[i].progress;

                    // Find the milestone before this switch using live width/height
                    const isMobileAnim = width < 640;
                    for (let m = milestones.length - 1; m >= 0; m--) {
                        const mx = isMobileAnim
                            ? computeMapX(getMobileNodeX(m), width)
                            : computeMapX(milestones[m].x, width);
                        const my = isMobileAnim
                            ? computeMapY(getMobileNodeY(m), height)
                            : computeMapY(milestones[m].y, height);

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

            for (let i = 0; i < pathPoints.length - 1; i++) {
                let segStart = 0;
                for (let j = 0; j < i; j++) {
                    segStart += segmentLengths[j];
                }
                const segEnd = segStart + segmentLengths[i];

                let hasOffSwitch = false;
                let gapStart = 0;
                let gapEnd = 0;

                for (let s = 0; s < switches.length; s++) {
                    if (!switchStatesRef.current[s]) {
                        const swPos = switches[s].progress * totalLength;
                        if (swPos >= segStart && swPos <= segEnd) {
                            hasOffSwitch = true;
                            const localProgress = (swPos - segStart) / segmentLengths[i];
                            const gapSize = 25;
                            gapStart = localProgress - (gapSize / 2) / segmentLengths[i];
                            gapEnd = localProgress + (gapSize / 2) / segmentLengths[i];
                            break;
                        }
                    }
                }

                if (hasOffSwitch) {
                    if (gapStart > 0) {
                        ctx.beginPath();
                        ctx.strokeStyle = "#888";
                        ctx.moveTo(pathPoints[i].x, pathPoints[i].y);
                        const gapX1 = pathPoints[i].x + (pathPoints[i + 1].x - pathPoints[i].x) * gapStart;
                        const gapY1 = pathPoints[i].y + (pathPoints[i + 1].y - pathPoints[i].y) * gapStart;
                        ctx.lineTo(gapX1, gapY1);
                        ctx.stroke();
                    }
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
                    ctx.beginPath();
                    ctx.strokeStyle = "#888";
                    ctx.moveTo(pathPoints[i].x, pathPoints[i].y);
                    ctx.lineTo(pathPoints[i + 1].x, pathPoints[i + 1].y);
                    ctx.stroke();
                }
            }

            // Draw activated path with glow
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

            // Draw switches
            switches.forEach((sw) => {
                const isOn = switchStatesRef.current[sw.id];
                const circleRadius = 8;
                const lineLength = 20;

                ctx.beginPath();
                ctx.arc(sw.x - lineLength, sw.y, circleRadius, 0, Math.PI * 2);
                ctx.strokeStyle = "#888";
                ctx.lineWidth = 3;
                ctx.fillStyle = "#000";
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(sw.x + lineLength, sw.y, circleRadius, 0, Math.PI * 2);
                ctx.strokeStyle = "#888";
                ctx.lineWidth = 3;
                ctx.fillStyle = "#000";
                ctx.fill();
                ctx.stroke();

                if (isOn) {
                    ctx.beginPath();
                    ctx.strokeStyle = "#888";
                    ctx.lineWidth = 5;
                    ctx.moveTo(sw.x - lineLength, sw.y);
                    ctx.lineTo(sw.x + lineLength, sw.y);
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.strokeStyle = "#888";
                    ctx.lineWidth = 5;
                    ctx.moveTo(sw.x - lineLength, sw.y);
                    ctx.lineTo(sw.x + lineLength - 8, sw.y - 18);
                    ctx.stroke();
                }
            });

            // Draw nodes — use computeMapX/Y with live width/height
            const isMobileCanvas = width < 640;
            milestones.forEach((milestone, index) => {
                const x = isMobileCanvas
                    ? computeMapX(getMobileNodeX(index), width)
                    : computeMapX(milestone.x, width);
                const y = isMobileCanvas
                    ? computeMapY(getMobileNodeY(index), height)
                    : computeMapY(milestone.y, height);

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
            canvas.removeEventListener('touchend', handleCanvasTouch);
            cancelAnimationFrame(animationFrame);
        };
    }, [scrollProgress, canvasSize.width, canvasSize.height, renderTrigger]);

    // isMilestoneActive runs during React render — canvasSize state is correct here
    const isMilestoneActive = (index: number) => {
        const switches = getSwitchPositions(canvasSize.width, canvasSize.height);
        const milestoneProgress = index / (milestones.length - 1);

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
            <div className="sticky top-0 h-screen" style={{ position: "sticky" }}>

                {/* Canvas absolutely fills full screen so glow never clips */}
                <div className="absolute inset-0 flex justify-center items-center" style={{ zIndex: 10 }}>
                    <canvas ref={canvasRef} />
                </div>

                {/* Heading fixed at top with z-index above canvas */}
                <div className="absolute top-0 left-0 right-0 flex justify-center pt-8" style={{ zIndex: 10 }}>
                    <h2
                        className="text-center font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] px-4"
                        style={{
                            fontSize: "clamp(1.2rem, 4vw, 3.75rem)",
                            color: scrollProgress > 0.05 ? "#FFD700" : "#888",
                            textShadow: scrollProgress > 0.05 ? "0 0 50px rgba(255,215,0,0.5)" : "none",
                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                            fontFamily: "system-ui, -apple-system, sans-serif"
                        }}
                    >
                        TIME LINE CIRCUIT
                    </h2>
                </div>

                {/* Milestone labels absolutely positioned over canvas */}
                <div className="absolute inset-0 flex justify-center items-center" style={{ zIndex: 5, pointerEvents: "none" }}>
                    <div className="relative" style={{ width: canvasSize.width, height: canvasSize.height }}>
                        {milestones.map((milestone, index) => {
                            const isActive = isMilestoneActive(index);
                            const intensity = isActive ? 1 : 0;

                            // Use mobile node positions when on mobile
                            const nodeX = isMobile
                                ? mapX(getMobileNodeX(index))
                                : mapX(milestone.x);
                            const nodeY = isMobile
                                ? mapY(getMobileNodeY(index))
                                : mapY(milestone.y);

                            // Label width
                            const labelW = isMobile
                                ? canvasSize.width * 0.36
                                : Math.min(220, canvasSize.width * 0.18);

                            // Font scales with viewport width
                            const yearSize = isMobile ? "clamp(0.6rem, 3vw, 0.78rem)" : "clamp(0.85rem, 1.2vw, 1.1rem)";
                            const titleSize = isMobile ? "clamp(0.55rem, 2.6vw, 0.7rem)" : "clamp(0.75rem, 1vw, 1rem)";
                            const locSize = isMobile ? "clamp(0.5rem, 2.3vw, 0.65rem)" : "clamp(0.65rem, 0.9vw, 0.875rem)";
                            const dateSize = isMobile ? "clamp(0.45rem, 2vw, 0.58rem)" : "clamp(0.6rem, 0.8vw, 0.75rem)";

                            // Estimated label height in px (4 lines × ~14px each)
                            const labelH = isMobile ? 56 : 70;
                            const nodeR = 18; // node radius
                            const gap = 8;

                            let textLeft: number;
                            let textTop: number;

                            if (isMobile) {
                                // Left nodes (even): label centered on node horizontally, above the node
                                // Right nodes (odd): label centered on node horizontally, below the node
                                const isLeft = index % 2 === 0;
                                textLeft = nodeX - labelW / 2;
                                textTop = isLeft
                                    ? nodeY - nodeR - gap - labelH   // above
                                    : nodeY + nodeR + gap;            // below
                            } else {
                                // Desktop: label left or right of node
                                const gap20 = 20;
                                if (milestone.x < 0.4) {
                                    textLeft = nodeX - labelW - gap20;
                                } else {
                                    textLeft = nodeX + gap20;
                                }
                                textTop = nodeY - 25;
                            }

                            // Clamp horizontally so label never exits screen
                            textLeft = Math.max(4, Math.min(textLeft, canvasSize.width - labelW - 4));

                            return (
                                <div
                                    key={milestone.id}
                                    className="absolute pointer-events-none"
                                    style={{
                                        left: `${textLeft}px`,
                                        top: `${textTop}px`,
                                        transition: "opacity 0.4s ease",
                                        width: `${labelW}px`,
                                    }}
                                >
                                    <div className="flex flex-col">
                                        <span
                                            style={{
                                                fontSize: yearSize,
                                                fontWeight: "bold",
                                                letterSpacing: "0.05em",
                                                marginBottom: "0.15em",
                                                color: isActive ? `rgba(255, 215, 0, ${intensity})` : "#888",
                                                textShadow: isActive ? `0 0 ${20 * intensity}px rgba(255,255,150,${intensity * 0.6}), 0 0 ${40 * intensity}px rgba(255,255,150,${intensity * 0.7})` : "none",
                                                fontFamily: "system-ui, -apple-system, sans-serif",
                                                transition: "all 0.3s ease"
                                            }}
                                        >
                                            {milestone.year}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: titleSize,
                                                fontWeight: "600",
                                                marginBottom: "0.15em",
                                                color: isActive ? `rgba(255, 240, 180, ${0.95 * intensity})` : "#888",
                                                transition: "all 0.3s ease",
                                                lineHeight: "1.3"
                                            }}
                                        >
                                            {milestone.title}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: locSize,
                                                color: isActive ? `rgba(180, 180, 180, ${0.85 + intensity * 0.15})` : "#888",
                                                transition: "all 0.3s ease",
                                                lineHeight: "1.4"
                                            }}
                                        >
                                            {milestone.location}
                                        </span>
                                        {milestone.date && (
                                            <span
                                                style={{
                                                    fontSize: dateSize,
                                                    marginTop: "0.2em",
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

            </div>
        </section>
    );
}