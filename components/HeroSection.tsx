"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const letterRefs = useRef<HTMLSpanElement[]>([]);
    const subTextLetterRefs = useRef<HTMLSpanElement[]>([]);
    const isLightOnRef = useRef(false);
    const [isLightOn, setIsLightOn] = useState(false);
    // Keep the switch hint in component state only (no browser storage).
    // It will show on initial load and reset on full page refresh.
    const [showSwitchHint, setShowSwitchHint] = useState<boolean>(true);
    const [ropePositions, setRopePositions] = useState({ bulbX: '50%', switchX: '50%' });

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        // Ensure the canvas CSS size matches the drawing buffer so
        // DOM-based coordinates (percentages) align with canvas pixels.
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        const originX = canvas.width / 2;
        const originY = 0;
        const bulbRadius = 25;
        const segments = 30;
        const naturalRopeLength = 400;
        const maxStretch = 650;
        const minRopeLength = 150;

        const switchOriginX = canvas.width / 2 + 150;
        const switchOriginY = 0;
        const switchNaturalLength = 200;
        const switchMaxStretch = 325;
        const switchMinLength = 75;
        const switchRadius = 12;

        // Calculate rope positions as percentages for text positioning
        const bulbRopePercent = (originX / canvas.width) * 100;
        const switchRopePercent = (switchOriginX / canvas.width) * 100;
        setRopePositions({
            bulbX: `${bulbRopePercent}%`,
            switchX: `${switchRopePercent}%`
        });

        const springConstant = 0.035;
        const damping = 0.94; // Reduced from 0.96 for smoother motion
        const gravity = 0.6;
        const mass = 1.2;

        let bulbX = originX;
        let bulbY = originY + naturalRopeLength;
        let velocityX = 0;
        let velocityY = 0;
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        let switchX = switchOriginX;
        let switchY = switchOriginY + switchNaturalLength;
        let switchVelocityX = 0;
        let switchVelocityY = 0;
        let isSwitchDragging = false;
        let switchDragOffsetX = 0;
        let switchDragOffsetY = 0;

        // Start the bulb OFF by default (client state mirrors this via isLightOnRef)
        let isLightOn = isLightOnRef.current;
        let lightIntensity = isLightOn ? 1.0 : 0.0;

        let hasFlickered = false;
        let flickerActive = true;
        let flickerTimer = 0;
        const flickerDurationFrames = 72 + Math.floor(Math.random() * 60);
        let burstCountdown = 0;

        // CRITICAL PERFORMANCE: Cache positions once, update only every 10 frames or on resize
        let cachedPositions: Array<{ x: number, y: number, element: HTMLSpanElement }> = [];
        let frameCount = 0;
        const POSITION_CACHE_FRAMES = 10;

        const updatePositionCache = () => {
            cachedPositions = [];
            letterRefs.current.forEach((el) => {
                if (el) {
                    const rect = el.getBoundingClientRect();
                    cachedPositions.push({
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                        element: el
                    });
                }
            });
            subTextLetterRefs.current.forEach((el) => {
                if (el) {
                    const rect = el.getBoundingClientRect();
                    cachedPositions.push({
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                        element: el
                    });
                }
            });
        };
        // Keep a lightweight ref of the last rope positions (pixels) to avoid
        // calling setState every frame. We'll only update when position shifts
        // beyond a small threshold.
        const ropePosRef = { bulbX: 0, switchX: 0 } as { bulbX: number; switchX: number };

        // Wait for DOM to be ready
        setTimeout(updatePositionCache, 100);

        const handlePointerDown = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

            const switchDx = clientX - switchX;
            const switchDy = clientY - switchY;
            const switchDistance = Math.sqrt(switchDx * switchDx + switchDy * switchDy);

            if (switchDistance <= switchRadius + 30) {
                isSwitchDragging = true;
                switchDragOffsetX = clientX - switchX;
                switchDragOffsetY = clientY - switchY;
                switchVelocityX = 0;
                switchVelocityY = 0;
                return;
            }

            const dx = clientX - bulbX;
            const dy = clientY - bulbY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= bulbRadius + 30) {
                isDragging = true;
                dragOffsetX = clientX - bulbX;
                dragOffsetY = clientY - bulbY;
                velocityX = 0;
                velocityY = 0;
            }
        };

        const handlePointerMove = (e: MouseEvent | TouchEvent) => {
            if (!isDragging && !isSwitchDragging) return;
            e.preventDefault();

            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

            if (isSwitchDragging) {
                switchX = clientX - switchDragOffsetX;
                switchY = clientY - switchDragOffsetY;

                const dx = switchX - switchOriginX;
                const dy = switchY - switchOriginY;
                const currentLength = Math.sqrt(dx * dx + dy * dy);

                if (currentLength > switchMaxStretch) {
                    const ratio = switchMaxStretch / currentLength;
                    switchX = switchOriginX + dx * ratio;
                    switchY = switchOriginY + dy * ratio;
                } else if (currentLength < switchMinLength) {
                    const ratio = switchMinLength / currentLength;
                    switchX = switchOriginX + dx * ratio;
                    switchY = switchOriginY + dy * ratio;
                }
            } else if (isDragging) {
                bulbX = clientX - dragOffsetX;
                bulbY = clientY - dragOffsetY;

                const dx = bulbX - originX;
                const dy = bulbY - originY;
                const currentLength = Math.sqrt(dx * dx + dy * dy);

                if (currentLength > maxStretch) {
                    const ratio = maxStretch / currentLength;
                    bulbX = originX + dx * ratio;
                    bulbY = originY + dy * ratio;
                } else if (currentLength < minRopeLength) {
                    const ratio = minRopeLength / currentLength;
                    bulbX = originX + dx * ratio;
                    bulbY = originY + dy * ratio;
                }
            }
        };

        const handlePointerUp = () => {
            if (isSwitchDragging) {
                isLightOn = !isLightOn;
                isLightOnRef.current = isLightOn;
                setIsLightOn(isLightOn);
                if (showSwitchHint) {
                    setShowSwitchHint(false);
                }
            }
            isDragging = false;
            isSwitchDragging = false;
        };

        canvas.addEventListener('mousedown', handlePointerDown, { passive: false });
        canvas.addEventListener('mousemove', handlePointerMove, { passive: false });
        canvas.addEventListener('mouseup', handlePointerUp);
        canvas.addEventListener('mouseleave', handlePointerUp);
        canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
        canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
        canvas.addEventListener('touchend', handlePointerUp);

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (isLightOn && flickerActive && !hasFlickered) {
                flickerTimer++;
                if (flickerTimer >= flickerDurationFrames) {
                    flickerActive = false;
                    hasFlickered = true;
                    lightIntensity = 1.0;
                } else {
                    burstCountdown--;
                    if (burstCountdown <= 0) {
                        lightIntensity = 0.6 + Math.random() * 0.5;
                        burstCountdown = 1 + Math.floor(Math.random() * 4);
                    } else {
                        lightIntensity = 0.1 + Math.random() * 0.3;
                    }
                }
            } else {
                lightIntensity = isLightOn ? 1.0 : 0.0;
            }

            if (!isDragging) {
                const dx = bulbX - originX;
                const dy = bulbY - originY;
                const currentLength = Math.sqrt(dx * dx + dy * dy);
                const stretch = currentLength - naturalRopeLength;

                const springForce = -springConstant * stretch;
                const springForceX = springForce * (dx / currentLength);
                const springForceY = springForce * (dy / currentLength);

                const stretchAmount = Math.abs(stretch);
                const speedBoost = 1 + (stretchAmount / naturalRopeLength) * 1.5;

                const accelerationX = (springForceX * speedBoost) / mass;
                const accelerationY = (springForceY * speedBoost) / mass + gravity;

                velocityX += accelerationX;
                velocityY += accelerationY;

                velocityX *= damping;
                velocityY *= damping;

                bulbX += velocityX;
                bulbY += velocityY;

                const newDx = bulbX - originX;
                const newDy = bulbY - originY;
                const newLength = Math.sqrt(newDx * newDx + newDy * newDy);

                if (newLength > maxStretch) {
                    const ratio = maxStretch / newLength;
                    bulbX = originX + newDx * ratio;
                    bulbY = originY + newDy * ratio;

                    const normalX = newDx / newLength;
                    const normalY = newDy / newLength;
                    const dotProduct = velocityX * normalX + velocityY * normalY;
                    velocityX -= 1.8 * dotProduct * normalX;
                    velocityY -= 1.8 * dotProduct * normalY;
                } else if (newLength < minRopeLength) {
                    const ratio = minRopeLength / newLength;
                    bulbX = originX + newDx * ratio;
                    bulbY = originY + newDy * ratio;

                    const normalX = newDx / newLength;
                    const normalY = newDy / newLength;
                    const dotProduct = velocityX * normalX + velocityY * normalY;
                    velocityX -= 1.5 * dotProduct * normalX;
                    velocityY -= 1.5 * dotProduct * normalY;
                }

                const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
                if (speed < 0.1 && Math.abs(stretch) < 10) {
                    velocityX *= 0.95;
                    velocityY *= 0.95;
                }
            }

            if (!isSwitchDragging) {
                const dx = switchX - switchOriginX;
                const dy = switchY - switchOriginY;
                const currentLength = Math.sqrt(dx * dx + dy * dy);
                const stretch = currentLength - switchNaturalLength;

                const springForce = -springConstant * stretch;
                const springForceX = springForce * (dx / currentLength);
                const springForceY = springForce * (dy / currentLength);

                const stretchAmount = Math.abs(stretch);
                const speedBoost = 1 + (stretchAmount / switchNaturalLength) * 1.5;

                const accelerationX = (springForceX * speedBoost) / mass;
                const accelerationY = (springForceY * speedBoost) / mass + gravity;

                switchVelocityX += accelerationX;
                switchVelocityY += accelerationY;

                switchVelocityX *= damping;
                switchVelocityY *= damping;

                switchX += switchVelocityX;
                switchY += switchVelocityY;

                const newDx = switchX - switchOriginX;
                const newDy = switchY - switchOriginY;
                const newLength = Math.sqrt(newDx * newDx + newDy * newDy);

                if (newLength > switchMaxStretch) {
                    const ratio = switchMaxStretch / newLength;
                    switchX = switchOriginX + newDx * ratio;
                    switchY = switchOriginY + newDy * ratio;

                    const normalX = newDx / newLength;
                    const normalY = newDy / newLength;
                    const dotProduct = switchVelocityX * normalX + switchVelocityY * normalY;
                    switchVelocityX -= 1.8 * dotProduct * normalX;
                    switchVelocityY -= 1.8 * dotProduct * normalY;
                } else if (newLength < switchMinLength) {
                    const ratio = switchMinLength / newLength;
                    switchX = switchOriginX + newDx * ratio;
                    switchY = switchOriginY + newDy * ratio;

                    const normalX = newDx / newLength;
                    const normalY = newDy / newLength;
                    const dotProduct = switchVelocityX * normalX + switchVelocityY * normalY;
                    switchVelocityX -= 1.5 * dotProduct * normalX;
                    switchVelocityY -= 1.5 * dotProduct * normalY;
                }

                const speed = Math.sqrt(switchVelocityX * switchVelocityX + switchVelocityY * switchVelocityY);
                if (speed < 0.1 && Math.abs(stretch) < 10) {
                    switchVelocityX *= 0.95;
                    switchVelocityY *= 0.95;
                }
            }

            const currentRopeLength = Math.sqrt(
                (bulbX - originX) ** 2 + (bulbY - originY) ** 2
            );
            const ropeStretchRatio = currentRopeLength / naturalRopeLength;

            // Update visible rope-aligned instruction positions occasionally
            // Convert canvas X to percentage of viewport width and only set
            // state when the value changes more than 0.5px to avoid re-renders.
            if (typeof setRopePositions === 'function') {
                // Keep instruction anchored to the static rope origin (switchOriginX)
                const switchPercent = (switchOriginX / canvas.width) * 100;
                const prevSwitch = ropePosRef.switchX;
                const switchDiff = Math.abs(switchPercent - prevSwitch);

                if (frameCount % 12 === 0 || isSwitchDragging) {
                    if (switchDiff > 0.05) {
                        ropePosRef.switchX = switchPercent;
                        setRopePositions((p) => ({ ...p, switchX: `${switchPercent}%` }));
                    }
                }
            }

            // Calculate rope endpoint at bulb top instead of center
            const bulbRopeDx = bulbX - originX;
            const bulbRopeDy = bulbY - originY;
            const bulbRopeDist = Math.sqrt(bulbRopeDx * bulbRopeDx + bulbRopeDy * bulbRopeDy);
            const bulbRopeEndX = bulbX - (bulbRopeDx / bulbRopeDist) * bulbRadius;
            const bulbRopeEndY = bulbY - (bulbRopeDy / bulbRopeDist) * bulbRadius;

            ctx.beginPath();
            ctx.strokeStyle = isDragging ? "#FFD700" : "#888";
            ctx.lineWidth = Math.max(1.5, 4 / ropeStretchRatio);

            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const x = originX + (bulbRopeEndX - originX) * t;
                const curveAmount = 40 / Math.pow(ropeStretchRatio, 1.2);
                const curve = Math.sin(Math.PI * t) * curveAmount;
                const y = originY + (bulbRopeEndY - originY) * t + curve;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            const currentSwitchLength = Math.sqrt(
                (switchX - switchOriginX) ** 2 + (switchY - switchOriginY) ** 2
            );
            const switchStretchRatio = currentSwitchLength / switchNaturalLength;

            // Calculate rope endpoint at switch top instead of center
            const switchRopeDx = switchX - switchOriginX;
            const switchRopeDy = switchY - switchOriginY;
            const switchRopeDist = Math.sqrt(switchRopeDx * switchRopeDx + switchRopeDy * switchRopeDy);
            const switchRopeEndX = switchX - (switchRopeDx / switchRopeDist) * switchRadius;
            const switchRopeEndY = switchY - (switchRopeDy / switchRopeDist) * switchRadius;

            ctx.beginPath();
            ctx.strokeStyle = isSwitchDragging ? "#FFD700" : "#888";
            ctx.lineWidth = Math.max(1.5, 4 / switchStretchRatio);

            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const x = switchOriginX + (switchRopeEndX - switchOriginX) * t;
                const curveAmount = 40 / Math.pow(switchStretchRatio, 1.2);
                const curve = Math.sin(Math.PI * t) * curveAmount;
                const y = switchOriginY + (switchRopeEndY - switchOriginY) * t + curve;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            if (lightIntensity > 0.5) {
                const glowRadius = bulbRadius * 12;
                const gradient = ctx.createRadialGradient(bulbX, bulbY, 0, bulbX, bulbY, glowRadius);
                gradient.addColorStop(0, `rgba(255, 240, 150, ${lightIntensity * 0.9})`);
                gradient.addColorStop(0.2, `rgba(255, 220, 120, ${lightIntensity * 0.7})`);
                gradient.addColorStop(0.5, `rgba(255, 200, 100, ${lightIntensity * 0.4})`);
                gradient.addColorStop(0.8, `rgba(255, 180, 80, ${lightIntensity * 0.2})`);
                gradient.addColorStop(1, `rgba(255, 160, 60, 0)`);

                ctx.beginPath();
                ctx.arc(bulbX, bulbY, glowRadius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            ctx.beginPath();
            ctx.arc(bulbX, bulbY, bulbRadius, 0, Math.PI * 2);
            const bulbGradient = ctx.createRadialGradient(bulbX, bulbY, 0, bulbX, bulbY, bulbRadius);
            if (lightIntensity > 0.5) {
                bulbGradient.addColorStop(0, `rgba(255, 245, 180, ${lightIntensity * 1.0})`);
                bulbGradient.addColorStop(0.7, `rgba(255, 215, 0, ${lightIntensity * 0.8})`);
                bulbGradient.addColorStop(1, `rgba(255, 180, 0, ${lightIntensity * 0.6})`);
            } else {
                bulbGradient.addColorStop(0, `rgba(200, 200, 200, 0.3)`);
                bulbGradient.addColorStop(0.7, `rgba(150, 150, 150, 0.4)`);
                bulbGradient.addColorStop(1, `rgba(100, 100, 100, 0.5)`);
            }
            ctx.fillStyle = bulbGradient;
            ctx.fill();
            ctx.strokeStyle = lightIntensity > 0.5 ? "#FFFFFF" : "#666";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = lightIntensity > 0.5 ? `rgba(255, 255, 255, ${lightIntensity})` : `rgba(150, 150, 150, 0.5)`;
            ctx.moveTo(bulbX - bulbRadius * 0.4, bulbY);
            ctx.lineTo(bulbX - bulbRadius * 0.2, bulbY - bulbRadius * 0.3);
            ctx.lineTo(bulbX + bulbRadius * 0.2, bulbY + bulbRadius * 0.3);
            ctx.lineTo(bulbX + bulbRadius * 0.4, bulbY);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(switchX, switchY, switchRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#E8E8E8";
            ctx.fill();
            ctx.strokeStyle = "#999";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // PERFORMANCE CRITICAL: Only update text every N frames
            frameCount++;
            if (frameCount % POSITION_CACHE_FRAMES === 0 && cachedPositions.length > 0) {
                const maxDist = 400;
                const maxDistSq = maxDist * maxDist; // Use squared distance to avoid sqrt

                for (let i = 0; i < cachedPositions.length; i++) {
                    const pos = cachedPositions[i];
                    const dx = bulbX - pos.x;
                    const dy = bulbY - pos.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq > maxDistSq) {
                        pos.element.style.color = 'rgba(128,128,128,0.5)';
                        pos.element.style.textShadow = 'none';
                    } else {
                        const distance = Math.sqrt(distSq);
                        const intensity = (1 - distance / maxDist) * lightIntensity;

                        if (intensity > 0.1) {
                            pos.element.style.color = `rgba(255,215,0,${intensity})`;
                            if (intensity > 0.05) {
                                const glow1 = 20 * intensity;
                                const glow2 = 40 * intensity;
                                const opacity2 = intensity * 0.7;
                                pos.element.style.textShadow = `0 0 ${glow1}px rgba(255,255,150,${intensity}),0 0 ${glow2}px rgba(255,255,200,${opacity2})`;
                            }
                        } else {
                            pos.element.style.color = 'rgba(128,128,128,0.5)';
                            pos.element.style.textShadow = 'none';
                        }
                    }
                }
            }

            requestAnimationFrame(draw);
        }

        draw();

        return () => {
            canvas.removeEventListener('mousedown', handlePointerDown);
            canvas.removeEventListener('mousemove', handlePointerMove);
            canvas.removeEventListener('mouseup', handlePointerUp);
            canvas.removeEventListener('mouseleave', handlePointerUp);
            canvas.removeEventListener('touchstart', handlePointerDown);
            canvas.removeEventListener('touchmove', handlePointerMove);
            canvas.removeEventListener('touchend', handlePointerUp);
        };
    }, []);

    const subTextContent = "Hi, I’ve been building full-stack web products, working across frontend and backend to design complete systems. I focus on transforming complex requirements into structured, scalable architecture building applications that feel effortless for users but are carefully engineered behind the scenes to know more about me scroll down.";

    return (
        <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="absolute top-0 left-0" />

            <div className="flex flex-col items-center justify-center">
                <h1
                    ref={textRef}
                    className="text-[8vw] text-gray-800 font-bold tracking-widest z-10 pointer-events-none"
                >
                    {"UJJAWAL".split("").map((ch, i) => (
                        <span
                            key={i}
                            ref={(el) => { if (el) letterRefs.current[i] = el; }}
                            className="inline-block"
                            style={{ willChange: 'color, text-shadow' }}
                        >
                            {ch}
                        </span>
                    ))}
                </h1>
            </div>

            {/* Instruction hint on switch rope (shows once) */}
            {showSwitchHint && !isLightOn && (
                <div
                    className="fixed top-1/4 z-20 animate-fade-in pointer-events-none"
                    style={{
                        left: ropePositions.switchX,
                        transform: 'translateX(-50%)',
                        transformOrigin: 'center center',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <p className="text-xs md:text-sm text-gray-500 font-medium tracking-wide blink">
                        Drag the button to turn on the bulb
                    </p>
                </div>
            )}

            {/* bulb instruction removed - only switch hint is shown */}

            {/* Description - overlaid without affecting layout */}
            <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-[70%] md:w-[50%] text-center z-10 pointer-events-none">
                <p className="text-[1.3vw] md:text-[1.1vw] font-medium tracking-wide leading-relaxed min-h-[100px] transition-opacity duration-500">
                    {isLightOn ? (
                        <span>
                            {(() => {
                                // Split into words and spaces so we wrap at word boundaries.
                                const tokens = subTextContent.split(/(\s+)/);
                                let letterIndex = 0;
                                return tokens.map((token, ti) => {
                                    if (/^\s+$/.test(token)) {
                                        // Render spaces with preserved whitespace so spacing remains.
                                        return (
                                            <span key={`sp-${ti}`} style={{ whiteSpace: 'pre' }}>
                                                {token}
                                            </span>
                                        );
                                    }

                                    // Render each word as an inline-block so the whole word
                                    // wraps to the next line instead of breaking mid-word.
                                    return (
                                        <span key={`w-${ti}`} style={{ display: 'inline-block' }}>
                                            {token.split("").map((ch, j) => {
                                                const idx = letterIndex++;
                                                return (
                                                    <span
                                                        key={`l-${ti}-${j}`}
                                                        ref={(el) => { if (el) subTextLetterRefs.current[idx] = el; }}
                                                        className="inline-block"
                                                        style={{
                                                            color: "rgba(128,128,128,0.5)",
                                                            whiteSpace: 'normal',
                                                            willChange: 'color, text-shadow'
                                                        }}
                                                    >
                                                        {ch}
                                                    </span>
                                                );
                                            })}
                                        </span>
                                    );
                                });
                            })()}
                        </span>
                    ) : (
                        <span className="text-gray-500 font-medium">
                            Turn on the bulb to know about me.
                        </span>
                    )}
                </p>
            </div>
        </section>
    );
}