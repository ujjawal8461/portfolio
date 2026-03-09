"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };

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

        let points: Point[] = Array.from({ length: 15 }, () => ({ x: -100, y: -100 }));

        let mouse = { x: -100, y: -100 };

        const onMouseMove = (e: MouseEvent) => {
            mouse = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("mousemove", onMouseMove);

        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            if (mouse.x !== -100) {
                // Initialize points if first time to prevent lines from off-screen
                if (points[0].x === -100) {
                    for (let i = 0; i < points.length; i++) {
                        points[i] = { x: mouse.x, y: mouse.y };
                    }
                }

                // Head follows mouse smoothly
                points[0].x += (mouse.x - points[0].x) * 0.5;
                points[0].y += (mouse.y - points[0].y) * 0.5;

                // Rest follows the previous point
                for (let i = 1; i < points.length; i++) {
                    const damping = 0.5; // Controls the "curviness" and stretch
                    points[i].x += (points[i - 1].x - points[i].x) * damping;
                    points[i].y += (points[i - 1].y - points[i].y) * damping;
                }
            }

            if (points[0].x !== -100) {
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length - 1; i++) {
                    const xc = (points[i].x + points[i + 1].x) / 2;
                    const yc = (points[i].y + points[i + 1].y) / 2;
                    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
                }
                ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 1.5; // Very thin
                ctx.strokeStyle = "rgba(255, 215, 0, 0.6)"; // Subtle golden color
                ctx.stroke();
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
