"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; age: number };

export default function CustomCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener("resize", resize);

        let points: Point[] = [];
        const maxAge = 12; // Much shorter tail so it doesn't look huge when moving fast

        let lastMouse = { x: -1, y: -1 };

        const onMouseMove = (e: MouseEvent) => {
            const currentMouse = { x: e.clientX, y: e.clientY };

            if (lastMouse.x !== -1 && lastMouse.y !== -1) {
                const dx = currentMouse.x - lastMouse.x;
                const dy = currentMouse.y - lastMouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Add interpolated points so the snake tail remains continuous even if mouse is moved very fast
                const steps = Math.max(1, Math.floor(distance / 5));
                for (let i = 0; i < steps; i++) {
                    points.push({
                        x: lastMouse.x + dx * (i / steps),
                        y: lastMouse.y + dy * (i / steps),
                        age: 0,
                    });
                }
            }

            points.push({ x: currentMouse.x, y: currentMouse.y, age: 0 });
            lastMouse = currentMouse;
        };

        window.addEventListener("mousemove", onMouseMove);

        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            if (points.length > 1) {
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length - 1; i++) {
                    const xc = (points[i].x + points[i + 1].x) / 2;
                    const yc = (points[i].y + points[i + 1].y) / 2;
                    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
                }
                // Connect the last point
                ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 1.5; // Very thin
                ctx.strokeStyle = "rgba(255, 215, 0, 0.6)"; // Subtle golden color
                ctx.stroke();
            }

            // Age points and remove old ones
            for (let i = 0; i < points.length; i++) {
                points[i].age++;
            }
            points = points.filter(p => p.age < maxAge);

            // Taper effect: slowly pull the oldest points towards the newer ones to shorten the tail smoothly
            if (points.length > 2) {
                points.shift();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed top-0 left-0 w-full h-full z-[9999]"
            style={{
                pointerEvents: "none",
                zIndex: 9999,
            }}
        />
    );
}
