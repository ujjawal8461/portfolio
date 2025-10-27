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
        const ropeLength = 400;

        let angle = Math.PI / 4;
        let angularVelocity = 0;
        const gravity = 0.005;
        const damping = 0.97;
        let frame = 0;

        // Flicker control (unchanged, assuming previous modifications)
        let isFlickering = true;
        let flickerFrame = 0;
        const maxFlickerFrames = 300;
        let lightIntensity = 1.0;
        let flickerTimer = 0;
        const flickerInterval = () => Math.random() * 30 + 10;
        let nextFlicker = flickerInterval();

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Pendulum physics (unchanged)
            const angularAcceleration = -gravity * Math.sin(angle);
            angularVelocity += angularAcceleration;
            angularVelocity *= damping;
            angle += angularVelocity;

            const bulbX = originX + ropeLength * Math.sin(angle);
            const bulbY = originY + ropeLength * Math.cos(angle);

            // Draw U-shaped rope (unchanged)
            ctx.beginPath();
            ctx.strokeStyle = "#888";
            ctx.lineWidth = 4;
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const x = originX + (bulbX - originX) * t;
                const curve = Math.sin(Math.PI * t) * 40;
                const y = originY + (bulbY - originY) * t + curve;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Flicker logic (unchanged)
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
            const glowRadius = bulbRadius * 12; // Increased radius for wider spread
            const gradient = ctx.createRadialGradient(bulbX, bulbY, 0, bulbX, bulbY, glowRadius);
            gradient.addColorStop(0, `rgba(255, 240, 150, ${lightIntensity * 0.9})`); // Bright warm core
            gradient.addColorStop(0.2, `rgba(255, 220, 120, ${lightIntensity * 0.7})`); // Soft warm glow
            gradient.addColorStop(0.5, `rgba(255, 200, 100, ${lightIntensity * 0.4})`); // Fading warm light
            gradient.addColorStop(0.8, `rgba(255, 180, 80, ${lightIntensity * 0.2})`); // Subtle outer fade
            gradient.addColorStop(1, `rgba(255, 160, 60, 0)`); // Fully transparent edge

            ctx.beginPath();
            ctx.arc(bulbX, bulbY, glowRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Realistic bulb with inner glow
            ctx.beginPath();
            ctx.arc(bulbX, bulbY, bulbRadius, 0, Math.PI * 2);
            const bulbGradient = ctx.createRadialGradient(bulbX, bulbY, 0, bulbX, bulbY, bulbRadius);
            bulbGradient.addColorStop(0, `rgba(255, 245, 180, ${lightIntensity * 1.0})`); // Bright inner glow
            bulbGradient.addColorStop(0.7, `rgba(255, 215, 0, ${lightIntensity * 0.8})`); // Warm bulb color
            bulbGradient.addColorStop(1, `rgba(255, 180, 0, ${lightIntensity * 0.6})`); // Darker edge
            ctx.fillStyle = bulbGradient;
            ctx.fill();
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw filament (unchanged)
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

            // Text glow and color (unchanged)
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
    }, []);

    return (
        <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="absolute top-0 left-0" />
            <h1 ref={textRef} className="text-[8vw] text-gray-800 font-bold tracking-widest z-10 relative">
                UJJAWAL
            </h1>
        </section>
    );
}