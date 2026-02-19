"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const letterRefs = useRef<HTMLSpanElement[]>([]);
    const subTextLetterRefs = useRef<HTMLSpanElement[]>([]);
    const isLightOnRef = useRef(false);
    const [isLightOn, setIsLightOn] = useState(false);
    const [showSwitchHint, setShowSwitchHint] = useState<boolean>(true);
    const [ropePositions, setRopePositions] = useState({ bulbX: '50%', switchX: '50%' });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        let animationFrameId: number;

        // Get responsive parameters
        const getResponsiveParams = () => {
            // Use window.innerWidth as the source, but it will be overridden by resizeCanvas if needed
            const screenWidth = window.innerWidth;
            const isMobileView = screenWidth < 768;
            const isTabletView = screenWidth >= 768 && screenWidth < 1024;
            const scaleFactor = isMobileView ? 0.7 : isTabletView ? 0.85 : 1;

            // Position based on percentages (from desktop 1920px layout)
            // Bulb: 50% from left
            // Switch: 57.81% from left
            const bulbPercentage = 50;
            const switchPercentage = 57.81;

            return {
                isMobileView,
                isTabletView,
                scaleFactor,
                originX: (screenWidth * bulbPercentage) / 100,
                originY: 0,
                bulbRadius: 25 * scaleFactor,
                segments: 30,
                naturalRopeLength: isMobileView ? 250 : isTabletView ? 350 : 400,
                maxStretch: isMobileView ? 400 : isTabletView ? 550 : 650,
                minRopeLength: isMobileView ? 100 : isTabletView ? 125 : 150,
                switchOffsetX: (screenWidth * (switchPercentage - bulbPercentage)) / 100,
                switchNaturalLength: isMobileView ? 150 : isTabletView ? 175 : 200,
                switchMaxStretch: isMobileView ? 250 : isTabletView ? 290 : 325,
                switchMinLength: isMobileView ? 60 : isTabletView ? 70 : 75,
                switchRadius: 12 * scaleFactor
            };
        };

        let params = getResponsiveParams();
        let switchOriginX = params.originX + params.switchOffsetX;
        let switchOriginY = params.originY;

        // Log initial positions
        console.log(`Screen: ${window.innerWidth}px | Bulb: ${params.originX.toFixed(0)}px (50%) | Switch: ${switchOriginX.toFixed(0)}px (57.81%)`);

        // Physics state  
        let bulbX = params.originX;
        let bulbY = params.originY + params.naturalRopeLength;
        let velocityX = 0;
        let velocityY = 0;
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        let switchX = switchOriginX;
        let switchY = switchOriginY + params.switchNaturalLength;
        let switchVelocityX = 0;
        let switchVelocityY = 0;
        let isSwitchDragging = false;
        let switchDragOffsetX = 0;
        let switchDragOffsetY = 0;

        let isLightOn = isLightOnRef.current;
        let lightIntensity = isLightOn ? 1.0 : 0.0;
        let hasFlickered = false;
        let flickerActive = true;
        let flickerTimer = 0;
        const flickerDurationFrames = 72 + Math.floor(Math.random() * 60);
        let burstCountdown = 0;

        const springConstant = 0.035;
        const damping = 0.94;
        const gravity = 0.6;
        const mass = 1.2;

        let cachedPositions: Array<{ x: number, y: number, element: HTMLSpanElement }> = [];
        let frameCount = 0;
        const POSITION_CACHE_FRAMES = 10;
        const ropePosRef = { bulbX: 0, switchX: 0 };

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

        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);

            // Update responsive parameters
            params = getResponsiveParams();
            switchOriginX = params.originX + params.switchOffsetX;
            switchOriginY = params.originY;

            // Log positions on resize for debugging
            const bulbPositionPercent = (params.originX / window.innerWidth) * 100;
            const switchPositionPercent = (switchOriginX / window.innerWidth) * 100;

            let deviceType = '';
            if (window.innerWidth < 768) {
                deviceType = 'MOBILE';
            } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                deviceType = 'TABLET';
            } else {
                deviceType = 'DESKTOP';
            }

            // Update rope positions
            const bulbRopePercent = (params.originX / window.innerWidth) * 100;
            const switchRopePercent = (switchOriginX / window.innerWidth) * 100;
            setRopePositions({
                bulbX: `${bulbRopePercent}%`,
                switchX: `${switchRopePercent}%`
            });

            // Reset positions
            bulbX = params.originX;
            bulbY = params.originY + params.naturalRopeLength;
            velocityX = 0;
            velocityY = 0;

            switchX = switchOriginX;
            switchY = switchOriginY + params.switchNaturalLength;
            switchVelocityX = 0;
            switchVelocityY = 0;

            setTimeout(updatePositionCache, 100);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        setTimeout(updatePositionCache, 100);

        const getPointerPosition = (e: MouseEvent | TouchEvent) => {
            if ('touches' in e && e.touches.length > 0) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
        };

        const handlePointerDown = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            const { x: clientX, y: clientY } = getPointerPosition(e);
            const touchTargetRadius = params.isMobileView ? 50 : 30;

            const switchDx = clientX - switchX;
            const switchDy = clientY - switchY;
            const switchDistance = Math.sqrt(switchDx * switchDx + switchDy * switchDy);

            if (switchDistance <= params.switchRadius + touchTargetRadius) {
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

            if (distance <= params.bulbRadius + touchTargetRadius) {
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

            const { x: clientX, y: clientY } = getPointerPosition(e);

            if (isSwitchDragging) {
                switchX = clientX - switchDragOffsetX;
                switchY = clientY - switchDragOffsetY;

                const dx = switchX - switchOriginX;
                const dy = switchY - switchOriginY;
                const currentLength = Math.sqrt(dx * dx + dy * dy);

                if (currentLength > params.switchMaxStretch) {
                    const ratio = params.switchMaxStretch / currentLength;
                    switchX = switchOriginX + dx * ratio;
                    switchY = switchOriginY + dy * ratio;
                } else if (currentLength < params.switchMinLength) {
                    const ratio = params.switchMinLength / currentLength;
                    switchX = switchOriginX + dx * ratio;
                    switchY = switchOriginY + dy * ratio;
                }
            } else if (isDragging) {
                bulbX = clientX - dragOffsetX;
                bulbY = clientY - dragOffsetY;

                const dx = bulbX - params.originX;
                const dy = bulbY - params.originY;
                const currentLength = Math.sqrt(dx * dx + dy * dy);

                if (currentLength > params.maxStretch) {
                    const ratio = params.maxStretch / currentLength;
                    bulbX = params.originX + dx * ratio;
                    bulbY = params.originY + dy * ratio;
                } else if (currentLength < params.minRopeLength) {
                    const ratio = params.minRopeLength / currentLength;
                    bulbX = params.originX + dx * ratio;
                    bulbY = params.originY + dy * ratio;
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
        canvas.addEventListener('touchcancel', handlePointerUp);

        let lastKnownWidth = window.innerWidth;

        function draw() {
            // Check if width has changed and recalculate positions
            const currentWidth = window.innerWidth;
            if (currentWidth !== lastKnownWidth) {
                lastKnownWidth = currentWidth;
                // Resize canvas when width changes
                resizeCanvas();
                params = getResponsiveParams();
                switchOriginX = params.originX + params.switchOffsetX;
                switchOriginY = params.originY;
            }

            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            // Flicker effect
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

            // Bulb physics
            if (!isDragging) {
                const dx = bulbX - params.originX;
                const dy = bulbY - params.originY;
                const currentLength = Math.sqrt(dx * dx + dy * dy);
                const stretch = currentLength - params.naturalRopeLength;

                const springForce = -springConstant * stretch;
                const springForceX = springForce * (dx / currentLength);
                const springForceY = springForce * (dy / currentLength);

                const stretchAmount = Math.abs(stretch);
                const speedBoost = 1 + (stretchAmount / params.naturalRopeLength) * 1.5;

                const accelerationX = (springForceX * speedBoost) / mass;
                const accelerationY = (springForceY * speedBoost) / mass + gravity;

                velocityX += accelerationX;
                velocityY += accelerationY;
                velocityX *= damping;
                velocityY *= damping;
                bulbX += velocityX;
                bulbY += velocityY;

                const newDx = bulbX - params.originX;
                const newDy = bulbY - params.originY;
                const newLength = Math.sqrt(newDx * newDx + newDy * newDy);

                if (newLength > params.maxStretch) {
                    const ratio = params.maxStretch / newLength;
                    bulbX = params.originX + newDx * ratio;
                    bulbY = params.originY + newDy * ratio;
                    const normalX = newDx / newLength;
                    const normalY = newDy / newLength;
                    const dotProduct = velocityX * normalX + velocityY * normalY;
                    velocityX -= 1.8 * dotProduct * normalX;
                    velocityY -= 1.8 * dotProduct * normalY;
                } else if (newLength < params.minRopeLength) {
                    const ratio = params.minRopeLength / newLength;
                    bulbX = params.originX + newDx * ratio;
                    bulbY = params.originY + newDy * ratio;
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

            // Switch physics
            if (!isSwitchDragging) {
                const dx = switchX - switchOriginX;
                const dy = switchY - switchOriginY;
                const currentLength = Math.sqrt(dx * dx + dy * dy);
                const stretch = currentLength - params.switchNaturalLength;

                const springForce = -springConstant * stretch;
                const springForceX = springForce * (dx / currentLength);
                const springForceY = springForce * (dy / currentLength);

                const stretchAmount = Math.abs(stretch);
                const speedBoost = 1 + (stretchAmount / params.switchNaturalLength) * 1.5;

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

                if (newLength > params.switchMaxStretch) {
                    const ratio = params.switchMaxStretch / newLength;
                    switchX = switchOriginX + newDx * ratio;
                    switchY = switchOriginY + newDy * ratio;
                    const normalX = newDx / newLength;
                    const normalY = newDy / newLength;
                    const dotProduct = switchVelocityX * normalX + switchVelocityY * normalY;
                    switchVelocityX -= 1.8 * dotProduct * normalX;
                    switchVelocityY -= 1.8 * dotProduct * normalY;
                } else if (newLength < params.switchMinLength) {
                    const ratio = params.switchMinLength / newLength;
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

            // Update rope positions
            const currentRopeLength = Math.sqrt((bulbX - params.originX) ** 2 + (bulbY - params.originY) ** 2);
            const ropeStretchRatio = currentRopeLength / params.naturalRopeLength;

            if (frameCount % 12 === 0 || isSwitchDragging) {
                const switchPercent = (switchOriginX / window.innerWidth) * 100;
                const switchDiff = Math.abs(switchPercent - ropePosRef.switchX);
                if (switchDiff > 0.05) {
                    ropePosRef.switchX = switchPercent;
                    setRopePositions((p) => ({ ...p, switchX: `${switchPercent}%` }));
                }
            }

            // Draw bulb rope
            const bulbRopeDx = bulbX - params.originX;
            const bulbRopeDy = bulbY - params.originY;
            const bulbRopeDist = Math.sqrt(bulbRopeDx * bulbRopeDx + bulbRopeDy * bulbRopeDy);
            const bulbRopeEndX = bulbX - (bulbRopeDx / bulbRopeDist) * params.bulbRadius;
            const bulbRopeEndY = bulbY - (bulbRopeDy / bulbRopeDist) * params.bulbRadius;

            ctx.beginPath();
            ctx.strokeStyle = isDragging ? "#FFD700" : "#888";
            ctx.lineWidth = Math.max(1.5, 4 / ropeStretchRatio) * params.scaleFactor;

            for (let i = 0; i <= params.segments; i++) {
                const t = i / params.segments;
                const x = params.originX + (bulbRopeEndX - params.originX) * t;
                const curveAmount = (40 / Math.pow(ropeStretchRatio, 1.2)) * params.scaleFactor;
                const curve = Math.sin(Math.PI * t) * curveAmount;
                const y = params.originY + (bulbRopeEndY - params.originY) * t + curve;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Draw switch rope
            const currentSwitchLength = Math.sqrt((switchX - switchOriginX) ** 2 + (switchY - switchOriginY) ** 2);
            const switchStretchRatio = currentSwitchLength / params.switchNaturalLength;

            const switchRopeDx = switchX - switchOriginX;
            const switchRopeDy = switchY - switchOriginY;
            const switchRopeDist = Math.sqrt(switchRopeDx * switchRopeDx + switchRopeDy * switchRopeDy);
            const switchRopeEndX = switchX - (switchRopeDx / switchRopeDist) * params.switchRadius;
            const switchRopeEndY = switchY - (switchRopeDy / switchRopeDist) * params.switchRadius;

            ctx.beginPath();
            ctx.strokeStyle = isSwitchDragging ? "#FFD700" : "#888";
            ctx.lineWidth = Math.max(1.5, 4 / switchStretchRatio) * params.scaleFactor;

            for (let i = 0; i <= params.segments; i++) {
                const t = i / params.segments;
                const x = switchOriginX + (switchRopeEndX - switchOriginX) * t;
                const curveAmount = (40 / Math.pow(switchStretchRatio, 1.2)) * params.scaleFactor;
                const curve = Math.sin(Math.PI * t) * curveAmount;
                const y = switchOriginY + (switchRopeEndY - switchOriginY) * t + curve;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Draw bulb glow
            if (lightIntensity > 0.5) {
                const glowRadius = params.bulbRadius * 12;
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

            // Draw bulb
            ctx.beginPath();
            ctx.arc(bulbX, bulbY, params.bulbRadius, 0, Math.PI * 2);
            const bulbGradient = ctx.createRadialGradient(bulbX, bulbY, 0, bulbX, bulbY, params.bulbRadius);
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
            ctx.lineWidth = 2 * params.scaleFactor;
            ctx.stroke();

            // Draw bulb filament
            ctx.beginPath();
            ctx.lineWidth = 1 * params.scaleFactor;
            ctx.strokeStyle = lightIntensity > 0.5 ? `rgba(255, 255, 255, ${lightIntensity})` : `rgba(150, 150, 150, 0.5)`;
            ctx.moveTo(bulbX - params.bulbRadius * 0.4, bulbY);
            ctx.lineTo(bulbX - params.bulbRadius * 0.2, bulbY - params.bulbRadius * 0.3);
            ctx.lineTo(bulbX + params.bulbRadius * 0.2, bulbY + params.bulbRadius * 0.3);
            ctx.lineTo(bulbX + params.bulbRadius * 0.4, bulbY);
            ctx.stroke();

            // Draw switch
            ctx.beginPath();
            ctx.arc(switchX, switchY, params.switchRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#E8E8E8";
            ctx.fill();
            ctx.strokeStyle = "#999";
            ctx.lineWidth = 1.5 * params.scaleFactor;
            ctx.stroke();

            // Update text lighting
            frameCount++;
            const maxDist = params.isMobileView ? 300 : params.isTabletView ? 350 : 400;
            const maxDistSq = maxDist * maxDist;

            // When bulb is ON, update every frame so all characters glow continuously.
            if (isLightOn) {
                const applyGlow = (el: HTMLSpanElement | undefined) => {
                    if (!el) return;
                    const rect = el.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const dx = bulbX - cx;
                    const dy = bulbY - cy;
                    const distSq = dx * dx + dy * dy;

                    if (distSq > maxDistSq) {
                        el.style.color = 'rgba(128,128,128,0.5)';
                        el.style.textShadow = 'none';
                    } else {
                        const distance = Math.sqrt(distSq);
                        const intensity = (1 - distance / maxDist) * lightIntensity;
                        const visibleIntensity = Math.max(0.25, intensity);
                        el.style.color = `rgba(255,215,0,${visibleIntensity})`;
                        const glow1 = 12 * intensity;
                        const glow2 = 28 * intensity;
                        const opacity2 = Math.min(0.85, intensity * 0.8);
                        el.style.textShadow = `0 0 ${glow1}px rgba(255,255,150,${intensity}),0 0 ${glow2}px rgba(255,200,0,${opacity2})`;
                    }
                };

                letterRefs.current.forEach((el) => applyGlow(el));
                subTextLetterRefs.current.forEach((el) => applyGlow(el));
            } else if (frameCount % POSITION_CACHE_FRAMES === 0) {
                // When bulb is OFF, update less frequently: reset to muted styles.
                letterRefs.current.forEach((el) => {
                    if (!el) return;
                    el.style.color = 'rgba(128,128,128,0.5)';
                    el.style.textShadow = 'none';
                });
                subTextLetterRefs.current.forEach((el) => {
                    if (!el) return;
                    el.style.color = 'rgba(128,128,128,0.5)';
                    el.style.textShadow = 'none';
                });
            }

            animationFrameId = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener('mousedown', handlePointerDown);
            canvas.removeEventListener('mousemove', handlePointerMove);
            canvas.removeEventListener('mouseup', handlePointerUp);
            canvas.removeEventListener('mouseleave', handlePointerUp);
            canvas.removeEventListener('touchstart', handlePointerDown);
            canvas.removeEventListener('touchmove', handlePointerMove);
            canvas.removeEventListener('touchend', handlePointerUp);
            canvas.removeEventListener('touchcancel', handlePointerUp);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [showSwitchHint]);

    const subTextContent = "Hi, I've been building full-stack web products, working across frontend and backend to design complete systems. I focus on transforming complex requirements into structured, scalable architecture building applications that feel effortless for users but are carefully engineered behind the scenes to know more about me scroll down.";

    return (
        <section className="relative w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="absolute top-0 left-0 touch-none" />

            <div className="flex flex-col items-center justify-center px-4">
                <h1
                    ref={textRef}
                    className="text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[7vw] text-gray-800 font-bold tracking-widest z-10 pointer-events-none text-center"
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

            {showSwitchHint && !isLightOn && (
                <div
                    className="fixed z-20 animate-fade-in pointer-events-none px-4"
                    style={{
                        left: ropePositions.switchX,
                        top: isMobile ? '20%' : '25%',
                        transform: 'translateX(-50%)',
                        transformOrigin: 'center center',
                        whiteSpace: 'nowrap',
                        maxWidth: '90vw'
                    }}
                >
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 font-medium tracking-wide pulse-glow text-center" style={{ fontFamily: 'var(--font-space-grotesk)', willChange: 'text-shadow, opacity' }}>
                        {"Turn on the bulb to know about me."}
                    </p>
                </div>
            )}

            <div className="absolute bottom-[15%] sm:bottom-[20%] md:bottom-[25%] left-1/2 transform -translate-x-1/2 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] text-center z-10 pointer-events-none px-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                <p className="text-[2.8vw] sm:text-[2.2vw] md:text-[1.6vw] lg:text-[1.3vw] xl:text-[1.1vw] font-medium tracking-wide leading-relaxed min-h-[60px] sm:min-h-[80px] md:min-h-[100px] transition-opacity duration-500">
                    {isLightOn ? (
                        <span>
                            {(() => {
                                const tokens = subTextContent.split(/(\s+)/);
                                let letterIndex = 0;
                                return tokens.map((token, ti) => {
                                    if (/^\s+$/.test(token)) {
                                        return (
                                            <span key={`sp-${ti}`} style={{ whiteSpace: 'pre' }}>
                                                {token}
                                            </span>
                                        );
                                    }

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
                        <span>
                            {(() => {
                                const text = "Turn on the bulb to know about me.";
                                let letterIndex = 0;
                                const tokens = text.split(/(\s+)/);
                                return tokens.map((token, ti) => {
                                    if (/^\s+$/.test(token)) {
                                        return (
                                            <span key={`sp-${ti}`} style={{ whiteSpace: 'pre' }}>
                                                {token}
                                            </span>
                                        );
                                    }

                                    return (
                                        <span key={`w-${ti}`} style={{ display: 'inline-block' }}>
                                            {token.split("").map((ch, j) => {
                                                const idx = letterIndex++;
                                                return (
                                                    <span
                                                        key={`l-${ti}-${j}`}
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
                    )}
                </p>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .animate-fade-in {
                    animation: fade-in 600ms cubic-bezier(.2,.8,.2,1) both;
                }

                @keyframes pulse-glow-frames {
                    0% {
                        opacity: 1;
                        text-shadow: 0 0 0 rgba(255,215,0,0);
                        color: rgba(128,128,128,0.95);
                    }
                    50% {
                        opacity: 1;
                        text-shadow: 0 0 8px rgba(255,215,0,0.9), 0 0 20px rgba(255,200,0,0.55);
                        color: rgba(255,215,0,0.95);
                    }
                    100% {
                        opacity: 1;
                        text-shadow: 0 0 0 rgba(255,215,0,0);
                        color: rgba(128,128,128,0.95);
                    }
                }

                .pulse-glow {
                    animation: pulse-glow-frames 2200ms ease-in-out infinite;
                    will-change: text-shadow, color, opacity;
                }
            `}</style>
        </section>
    );
}
