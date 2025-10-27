"use client";

import { useEffect, useRef } from "react";

export default function HeroSection() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);

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

        // Mouse/Touch interaction handlers
        const handlePointerDown = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

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
            if (!isDragging) return;
            e.preventDefault();

            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

            bulbX = clientX - dragOffsetX;
            bulbY = clientY - dragOffsetY;

            // Limit stretch and prevent getting too close
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
        };

        const handlePointerUp = () => {
            isDragging = false;
        };

        // Add event listeners
        canvas.addEventListener('mousedown', handlePointerDown, { passive: false });
        canvas.addEventListener('mousemove', handlePointerMove, { passive: false });
        canvas.addEventListener('mouseup', handlePointerUp);
        canvas.addEventListener('mouseleave', handlePointerUp);
        canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
        canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
        canvas.addEventListener('touchend', handlePointerUp);

        // Flicker control
        let isFlickering = true;
        let flickerFrame = 0;
        const maxFlickerFrames = 300;
        let lightIntensity = 1.0;
        let flickerTimer = 0;
        const flickerInterval = () => Math.random() * 30 + 10;
        let nextFlicker = flickerInterval();

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Realistic elastic physics with proper gravity
            if (!isDragging) {
                const dx = bulbX - originX;
                const dy = bulbY - originY;
                const currentLength = Math.sqrt(dx * dx + dy * dy);
                const stretch = currentLength - naturalRopeLength;

                // Calculate spring force (Hooke's Law: F = -kx)
                // Force points back toward natural length
                const springForce = -springConstant * stretch;
                const springForceX = springForce * (dx / currentLength);
                const springForceY = springForce * (dy / currentLength);

                // Speed increases with stretch amount
                const stretchAmount = Math.abs(stretch);
                const speedBoost = 1 + (stretchAmount / naturalRopeLength) * 1.5;

                // Apply forces with mass consideration (F = ma, so a = F/m)
                const accelerationX = (springForceX * speedBoost) / mass;
                const accelerationY = (springForceY * speedBoost) / mass + gravity;

                // Update velocity
                velocityX += accelerationX;
                velocityY += accelerationY;

                // Apply damping to velocity (energy loss)
                velocityX *= damping;
                velocityY *= damping;

                // Update position
                bulbX += velocityX;
                bulbY += velocityY;

                // Handle boundary constraints with realistic collision
                const newDx = bulbX - originX;
                const newDy = bulbY - originY;
                const newLength = Math.sqrt(newDx * newDx + newDy * newDy);

                if (newLength > maxStretch) {
                    // Hit max stretch - bounce back with reduced energy
                    const ratio = maxStretch / newLength;
                    bulbX = originX + newDx * ratio;
                    bulbY = originY + newDy * ratio;

                    // Reflect velocity and lose energy
                    const normalX = newDx / newLength;
                    const normalY = newDy / newLength;
                    const dotProduct = velocityX * normalX + velocityY * normalY;
                    velocityX -= 1.8 * dotProduct * normalX; // Reflect with energy loss
                    velocityY -= 1.8 * dotProduct * normalY;

                } else if (newLength < minRopeLength) {
                    // Too close to origin - push back
                    const ratio = minRopeLength / newLength;
                    bulbX = originX + newDx * ratio;
                    bulbY = originY + newDy * ratio;

                    const normalX = newDx / newLength;
                    const normalY = newDy / newLength;
                    const dotProduct = velocityX * normalX + velocityY * normalY;
                    velocityX -= 1.5 * dotProduct * normalX;
                    velocityY -= 1.5 * dotProduct * normalY;
                }

                // Slow down when velocity is very small (settle naturally)
                const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
                if (speed < 0.1 && Math.abs(stretch) < 10) {
                    velocityX *= 0.95;
                    velocityY *= 0.95;
                }
            }

            const currentRopeLength = Math.sqrt(
                (bulbX - originX) ** 2 + (bulbY - originY) ** 2
            );
            const ropeStretchRatio = currentRopeLength / naturalRopeLength;

            // Draw elastic rope with stretch effect
            ctx.beginPath();
            ctx.strokeStyle = isDragging ? "#FFD700" : "#888";
            ctx.lineWidth = Math.max(1.5, 4 / ropeStretchRatio);

            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const x = originX + (bulbX - originX) * t;

                // Natural curve that reduces with stretch
                const curveAmount = 40 / Math.pow(ropeStretchRatio, 1.2);
                const curve = Math.sin(Math.PI * t) * curveAmount;

                const y = originY + (bulbY - originY) * t + curve;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Flicker logic
            if (isFlickering) {
                flickerTimer++;
                if (flickerTimer >= nextFlicker) {
                    lightIntensity = Math.random() > 0.5 ? 1.0 : 0.0;
                    flickerTimer = 0;
                    nextFlicker = flickerInterval();
                }
                flickerFrame++;
                if (flickerFrame >= maxFlickerFrames) {
                    isFlickering = false;
                    lightIntensity = 1.0;
                }
            }

            // Realistic light spread with layered gradient
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

            // Realistic bulb with inner glow
            ctx.beginPath();
            ctx.arc(bulbX, bulbY, bulbRadius, 0, Math.PI * 2);
            const bulbGradient = ctx.createRadialGradient(bulbX, bulbY, 0, bulbX, bulbY, bulbRadius);
            bulbGradient.addColorStop(0, `rgba(255, 245, 180, ${lightIntensity * 1.0})`);
            bulbGradient.addColorStop(0.7, `rgba(255, 215, 0, ${lightIntensity * 0.8})`);
            bulbGradient.addColorStop(1, `rgba(255, 180, 0, ${lightIntensity * 0.6})`);
            ctx.fillStyle = bulbGradient;
            ctx.fill();
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw filament
            if (lightIntensity > 0.5) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${lightIntensity})`;
                ctx.lineWidth = 1;
                ctx.moveTo(bulbX - bulbRadius * 0.4, bulbY);
                ctx.lineTo(bulbX - bulbRadius * 0.2, bulbY - bulbRadius * 0.3);
                ctx.lineTo(bulbX + bulbRadius * 0.2, bulbY + bulbRadius * 0.3);
                ctx.lineTo(bulbX + bulbRadius * 0.4, bulbY);
                ctx.stroke();
            }

            // Text glow and color
            if (textRef.current) {
                const textRect = textRef.current.getBoundingClientRect();
                if (bulbY + bulbRadius > textRect.top && bulbY - bulbRadius < textRect.bottom) {
                    const textGlow = lightIntensity * 0.6;
                    textRef.current.style.color = lightIntensity > 0.5
                        ? `rgba(255, 215, 0, ${lightIntensity})`
                        : `rgba(128, 128, 128, 0.5)`;
                    textRef.current.style.textShadow =
                        `0 0 20px rgba(255,255,150,${textGlow}), 0 0 40px rgba(255,255,150,${textGlow * 0.7})`;
                } else {
                    textRef.current.style.color = `rgba(128, 128, 128, 0.5)`;
                    textRef.current.style.textShadow = "none";
                }
            }

            frame++;
            requestAnimationFrame(draw);
        }

        draw();

        // Cleanup event listeners
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
            <h1 ref={textRef} className="text-[8vw] text-gray-800 font-bold tracking-widest z-10 relative pointer-events-none">
                UJJAWAL
            </h1>
        </section>
    );
}