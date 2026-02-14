"use client";

import { useEffect, useRef } from "react";

export default function HeroSection() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const letterRefs = useRef<HTMLSpanElement[]>([]);
    const subTextLetterRefs = useRef<HTMLSpanElement[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

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

        const springConstant = 0.035;
        const damping = 0.96;
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

        let isLightOn = true;
        let lightIntensity = 1.0;

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

            ctx.beginPath();
            ctx.strokeStyle = isDragging ? "#FFD700" : "#888";
            ctx.lineWidth = Math.max(1.5, 4 / ropeStretchRatio);

            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const x = originX + (bulbX - originX) * t;
                const curveAmount = 40 / Math.pow(ropeStretchRatio, 1.2);
                const curve = Math.sin(Math.PI * t) * curveAmount;
                const y = originY + (bulbY - originY) * t + curve;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            const currentSwitchLength = Math.sqrt(
                (switchX - switchOriginX) ** 2 + (switchY - switchOriginY) ** 2
            );
            const switchStretchRatio = currentSwitchLength / switchNaturalLength;

            ctx.beginPath();
            ctx.strokeStyle = isSwitchDragging ? "#FFD700" : "#888";
            ctx.lineWidth = Math.max(1.5, 4 / switchStretchRatio);

            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const x = switchOriginX + (switchX - switchOriginX) * t;
                const curveAmount = 40 / Math.pow(switchStretchRatio, 1.2);
                const curve = Math.sin(Math.PI * t) * curveAmount;
                const y = switchOriginY + (switchY - switchOriginY) * t + curve;
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

            const beadGradient = ctx.createRadialGradient(
                switchX - switchRadius * 0.3,
                switchY - switchRadius * 0.3,
                0,
                switchX,
                switchY,
                switchRadius
            );
            beadGradient.addColorStop(0, "#C0C0C0");
            beadGradient.addColorStop(0.5, "#A0A0A0");
            beadGradient.addColorStop(1, "#808080");
            ctx.fillStyle = beadGradient;
            ctx.fill();

            ctx.strokeStyle = "#606060";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(switchX, switchY, switchRadius * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = "#404040";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(switchX - switchRadius * 0.3, switchY - switchRadius * 0.3, switchRadius * 0.25, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.fill();

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

    const subTextContent = "Hi, I’ve been building full-stack web products, working across frontend and backend to design complete systems. I focus on transforming complex requirements into structured, scalable architecture building applications that feel effortless for users but are carefully engineered behind the scenes.";

    return (
        <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="absolute top-0 left-0" />
            <h1
                ref={textRef}
                className="text-[8vw] text-gray-800 font-bold tracking-widest z-10 relative pointer-events-none"
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
            <p
                className="text-[1.3vw] md:text-[1.1vw] mt-6 font-medium tracking-wide text-center leading-relaxed w-[70%] md:w-[50%] z-10 pointer-events-none"
            >
                {subTextContent.split("").map((ch, i) => (
                    <span
                        key={i}
                        ref={(el) => { if (el) subTextLetterRefs.current[i] = el; }}
                        className="inline-block"
                        style={{
                            color: "rgba(128,128,128,0.5)",
                            whiteSpace: ch === " " ? "pre" : "normal",
                            willChange: 'color, text-shadow'
                        }}
                    >
                        {ch === " " ? "\u00A0" : ch}
                    </span>
                ))}
            </p>
        </section>
    );
}