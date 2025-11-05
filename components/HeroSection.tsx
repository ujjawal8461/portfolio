"use client";

import { useEffect, useRef } from "react";

export default function HeroSection() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const letterRefs = useRef<HTMLSpanElement[]>([]); // added for individual letters

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

        // Switch rope properties (half the bulb rope length)
        const switchOriginX = canvas.width / 2 + 150; // Position to the right
        const switchOriginY = 0;
        const switchNaturalLength = 200; // Half of bulb rope
        const switchMaxStretch = 325; // Half of bulb max stretch
        const switchMinLength = 75; // Half of bulb min length
        const switchRadius = 12; // Smaller than bulb

        // Realistic physics constants - balanced for natural motion
        const springConstant = 0.035; // Moderate spring force
        const damping = 0.96; // Gradual energy loss
        const gravity = 0.6; // Realistic gravity pull
        const mass = 1.2; // Bulb has weight

        // Elastic rope physics
        let bulbX = originX;
        let bulbY = originY + naturalRopeLength;
        let velocityX = 0;
        let velocityY = 0;
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let frame = 0;

        // Switch rope physics
        let switchX = switchOriginX;
        let switchY = switchOriginY + switchNaturalLength;
        let switchVelocityX = 0;
        let switchVelocityY = 0;
        let isSwitchDragging = false;
        let switchDragOffsetX = 0;
        let switchDragOffsetY = 0;

        // Light control - now controlled by switch
        let isLightOn = true;
        let lightIntensity = 1.0;

        // Flicker control - ONLY ON FIRST LOAD, 1.2-2.2 sec, chaotic bursts
        let hasFlickered = false;
        let flickerActive = true;
        let flickerTimer = 0;
        const flickerDurationFrames = 72 + Math.floor(Math.random() * 60); // 1.2-2.2 sec
        let burstCountdown = 0;

        // Mouse/Touch interaction handlers
        const handlePointerDown = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

            // Check switch first
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

            // Check bulb
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
            // Toggle light when releasing the switch
            if (isSwitchDragging) {
                isLightOn = !isLightOn;
                // NO flicker on toggle - only first load
            }
            isDragging = false;
            isSwitchDragging = false;
        };

        // Add event listeners
        canvas.addEventListener('mousedown', handlePointerDown, { passive: false });
        canvas.addEventListener('mousemove', handlePointerMove, { passive: false });
        canvas.addEventListener('mouseup', handlePointerUp);
        canvas.addEventListener('mouseleave', handlePointerUp);
        canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
        canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
        canvas.addEventListener('touchend', handlePointerUp);

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Flicker logic - ONLY ON FIRST LOAD
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

            // Realistic elastic physics with proper gravity
            if (!isDragging) {
                const dx = bulbX - originX;
                const dy = bulbY - originY;
                const currentLength = Math.sqrt(dx * dx + dy * dy);
                const stretch = currentLength - naturalRopeLength;

                // Calculate spring force (Hooke's Law: F = -kx)
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

            // Switch rope physics (same elastic behavior)
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

            // Draw elastic rope
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

            // Draw switch rope
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

            // Draw light glow only when intensity is high
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

            // Bulb
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

            // Filament - always visible, color changes based on state
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = lightIntensity > 0.5 ? `rgba(255, 255, 255, ${lightIntensity})` : `rgba(150, 150, 150, 0.5)`;
            ctx.moveTo(bulbX - bulbRadius * 0.4, bulbY);
            ctx.lineTo(bulbX - bulbRadius * 0.2, bulbY - bulbRadius * 0.3);
            ctx.lineTo(bulbX + bulbRadius * 0.2, bulbY + bulbRadius * 0.3);
            ctx.lineTo(bulbX + bulbRadius * 0.4, bulbY);
            ctx.stroke();

            // Draw rope pull switch (gray metallic style for traditional look)
            ctx.beginPath();
            ctx.arc(switchX, switchY, switchRadius, 0, Math.PI * 2);

            // Gray metallic gradient
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

            // Bead outline
            ctx.strokeStyle = "#606060";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Center hole
            ctx.beginPath();
            ctx.arc(switchX, switchY, switchRadius * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = "#404040";
            ctx.fill();

            // Highlight to give 3D effect
            ctx.beginPath();
            ctx.arc(switchX - switchRadius * 0.3, switchY - switchRadius * 0.3, switchRadius * 0.25, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.fill();

            // Text glow based on light state
            if (textRef.current) {
                const textRect = textRef.current.getBoundingClientRect();
                if (lightIntensity > 0.5 && bulbY + bulbRadius > textRect.top && bulbY - bulbRadius < textRect.bottom) {
                    const textGlow = lightIntensity * 0.6;
                    textRef.current.style.color = `rgba(255, 215, 0, ${lightIntensity})`;
                    textRef.current.style.textShadow =
                        `0 0 20px rgba(255,255,150,${textGlow}), 0 0 40px rgba(255,255,150,${textGlow * 0.7})`;
                } else {
                    textRef.current.style.color = `rgba(128, 128, 128, 0.5)`;
                    textRef.current.style.textShadow = "none";
                }
            }

            // Per-letter glow based on light state
            letterRefs.current.forEach((span) => {
                if (!span) return;
                const rect = span.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = bulbX - cx;
                const dy = bulbY - cy;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 400;

                const intensity = Math.max(0, 1 - distance / maxDist) * lightIntensity;

                span.style.color =
                    intensity > 0.1
                        ? `rgba(255,215,0,${intensity})`
                        : `rgba(100,100,100,0.4)`;

                span.style.textShadow =
                    intensity > 0.05
                        ? `0 0 ${20 * intensity}px rgba(255,255,150,${intensity}),
                           0 0 ${40 * intensity}px rgba(255,255,200,${intensity * 0.7})`
                        : "none";
            });

            frame++;
            requestAnimationFrame(draw);
        }

        draw();

        // Cleanup
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
                        className="inline-block transition-all duration-75"
                    >
                        {ch}
                    </span>
                ))}
            </h1>
        </section>
    );
}