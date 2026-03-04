"use client";

import { useEffect, useRef, useState } from "react";

const GITHUB_USERNAME = "ujjawal8461";

const SOCIALS = [
    {
        name: "GitHub",
        handle: "@ujjawal8461",
        url: "https://github.com/ujjawal8461",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
        ),
        color: "#e0e0e0"
    },
    {
        name: "LinkedIn",
        handle: "Ujjawal Singh",
        url: "https://linkedin.com/in/ujjawal-singh",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
        color: "#0A66C2"
    },
    {
        name: "Twitter",
        handle: "@ujjawal_dev",
        url: "https://twitter.com/ujjawal_dev",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        color: "#1DA1F2"
    },
    {
        name: "Instagram",
        handle: "@ujjawal.solanki",
        url: "https://instagram.com/ujjawal.solanki",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
        ),
        color: "#E1306C"
    },
    {
        name: "LeetCode",
        handle: "@ujjawal8461",
        url: "https://leetcode.com/ujjawal8461",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
            </svg>
        ),
        color: "#FFA116"
    }
];

export default function AboutSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const isPowered = (threshold: number) => scrollProgress > threshold;

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const handleScroll = () => {
            const rect = section.getBoundingClientRect();
            const wh = window.innerHeight;
            if (rect.top <= 0 && rect.bottom > wh) {
                const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - wh)));
                setScrollProgress(progress);
            } else if (rect.top > 0) setScrollProgress(0);
            else setScrollProgress(1);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const copyEmail = () => {
        navigator.clipboard.writeText("ujjawal.singh@gmail.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-black"
            style={{ minHeight: "280vh" }}
        >
            <div className="sticky top-0 h-screen flex flex-col items-center justify-start overflow-y-auto py-10 px-4" style={{ zIndex: 2 }}>

                {/* Title */}
                <h2
                    className="text-center text-5xl md:text-7xl font-bold tracking-[0.3em] uppercase mb-10"
                    style={{
                        color: isPowered(0.03) ? "#FFD700" : "#333",
                        textShadow: isPowered(0.03) ? "0 0 60px rgba(255,215,0,0.5), 0 0 120px rgba(255,215,0,0.2)" : "none",
                        transition: "all 0.6s ease",
                        fontFamily: "system-ui, -apple-system, sans-serif"
                    }}
                >
                    ABOUT ME
                </h2>

                <div className="w-full max-w-5xl flex flex-col gap-8">

                    {/* === BIO + CONTACT === */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Bio */}
                        <div
                            className="rounded-2xl p-6 transition-all duration-700"
                            style={{
                                border: `1px solid ${isPowered(0.08) ? "rgba(255,215,0,0.25)" : "rgba(40,40,40,0.6)"}`,
                                opacity: isPowered(0.08) ? 1 : 0.3,
                                transform: isPowered(0.08) ? "translateY(0)" : "translateY(20px)"
                            }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 rounded-full" style={{ background: isPowered(0.08) ? "#FFD700" : "#444", boxShadow: isPowered(0.08) ? "0 0 10px #FFD700" : "none" }} />
                                <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(255,215,0,0.6)" }}>Who I Am</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-1" style={{ color: isPowered(0.08) ? "#FFD700" : "#333", fontFamily: "system-ui" }}>
                                Ujjawal Singh Solanki
                            </h3>
                            <p className="text-sm mb-3" style={{ color: "rgba(255,215,0,0.5)" }}>Full-Stack Developer · Indore, India</p>
                            <p className="text-sm leading-relaxed" style={{ color: isPowered(0.08) ? "rgba(200,200,200,0.85)" : "#333" }}>
                                I build full-stack web products — from pixel-perfect frontends to scalable backends. Currently at Dexbytes Infotech, turning complex problems into clean, engineered solutions.
                            </p>
                            <div className="flex gap-4 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,215,0,0.1)" }}>
                                {[["B.Tech", "CS · CDGI"], ["2022", "PW Intern"], ["2024", "Dexbytes"]].map(([label, sub]) => (
                                    <div key={label}>
                                        <div className="text-sm font-bold" style={{ color: isPowered(0.08) ? "#FFD700" : "#333" }}>{label}</div>
                                        <div className="text-xs" style={{ color: "rgba(150,150,150,0.7)" }}>{sub}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact */}
                        <div
                            className="rounded-2xl p-6 transition-all duration-700"
                            style={{
                                border: `1px solid ${isPowered(0.12) ? "rgba(255,215,0,0.25)" : "rgba(40,40,40,0.6)"}`,
                                opacity: isPowered(0.12) ? 1 : 0.3,
                                transform: isPowered(0.12) ? "translateY(0)" : "translateY(20px)",
                                transitionDelay: "0.1s"
                            }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 rounded-full" style={{ background: isPowered(0.12) ? "#FFD700" : "#444", boxShadow: isPowered(0.12) ? "0 0 10px #FFD700" : "none" }} />
                                <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(255,215,0,0.6)" }}>Reach Me</span>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={copyEmail}
                                    className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-left transition-all duration-300"
                                    style={{ background: "rgba(255,215,0,0.04)", border: "1px solid rgba(255,215,0,0.12)", cursor: "pointer" }}
                                >
                                    <span style={{ color: "#FFD700" }}>✉</span>
                                    <div>
                                        <div className="text-xs" style={{ color: "rgba(150,150,150,0.7)" }}>Email</div>
                                        <div className="text-sm font-medium" style={{ color: isPowered(0.12) ? "rgba(255,215,0,0.9)" : "#444" }}>
                                            {copied ? "Copied! ✓" : "ujjawal.singh@gmail.com"}
                                        </div>
                                    </div>
                                </button>
                                <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "rgba(255,215,0,0.04)", border: "1px solid rgba(255,215,0,0.12)" }}>
                                    <span style={{ color: "#FFD700" }}>📱</span>
                                    <div>
                                        <div className="text-xs" style={{ color: "rgba(150,150,150,0.7)" }}>Phone</div>
                                        <div className="text-sm font-medium" style={{ color: isPowered(0.12) ? "rgba(255,215,0,0.9)" : "#444" }}>
                                            +91 98765 43210
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* === RESUME BUTTONS === */}
                    <div
                        className="flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700"
                        style={{
                            opacity: isPowered(0.2) ? 1 : 0,
                            transform: isPowered(0.2) ? "translateY(0)" : "translateY(30px)",
                            transitionDelay: "0.15s"
                        }}
                    >
                        <a
                            href="/resume.pdf"
                            download
                            className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300"
                            style={{
                                background: "rgba(255,215,0,0.08)",
                                border: "2px solid rgba(255,215,0,0.7)",
                                color: "#FFD700",
                                textDecoration: "none"
                            }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 40px rgba(255,215,0,0.35)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Resume
                        </a>
                        <a
                            href="/resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300"
                            style={{
                                border: "2px solid rgba(255,215,0,0.3)",
                                color: "rgba(255,215,0,0.8)",
                                textDecoration: "none"
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,215,0,0.06)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Resume
                        </a>
                    </div>

                    {/* === SOCIALS === */}
                    <div
                        className="rounded-2xl p-6 transition-all duration-700"
                        style={{
                            border: `1px solid ${isPowered(0.28) ? "rgba(255,215,0,0.2)" : "rgba(30,30,30,0.6)"}`,
                            opacity: isPowered(0.28) ? 1 : 0.2,
                            transform: isPowered(0.28) ? "translateY(0)" : "translateY(30px)",
                            transitionDelay: "0.2s"
                        }}
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-2 h-2 rounded-full" style={{ background: isPowered(0.28) ? "#FFD700" : "#444", boxShadow: isPowered(0.28) ? "0 0 10px #FFD700" : "none" }} />
                            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(255,215,0,0.6)" }}>Find Me Online</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {SOCIALS.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300"
                                    style={{
                                        background: hoveredSocial === i ? `${social.color}18` : "transparent",
                                        border: `1px solid ${hoveredSocial === i ? social.color + "55" : "rgba(255,215,0,0.1)"}`,
                                        textDecoration: "none",
                                        transform: hoveredSocial === i ? "translateY(-6px) scale(1.05)" : "none",
                                        boxShadow: hoveredSocial === i ? `0 10px 30px ${social.color}25` : "none"
                                    }}
                                    onMouseEnter={() => setHoveredSocial(i)}
                                    onMouseLeave={() => setHoveredSocial(null)}
                                >
                                    <span style={{ color: hoveredSocial === i ? social.color : "rgba(255,215,0,0.7)" }}>{social.icon}</span>
                                    <span className="text-xs font-bold tracking-wide" style={{ color: hoveredSocial === i ? social.color : "rgba(255,215,0,0.7)" }}>{social.name}</span>
                                    <span style={{ color: "rgba(120,120,120,0.8)", fontSize: "10px" }}>{social.handle}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* === GITHUB COMMIT CHART === */}
                    <div
                        className="rounded-2xl p-6 transition-all duration-700"
                        style={{
                            border: `1px solid ${isPowered(0.45) ? "rgba(255,215,0,0.2)" : "rgba(30,30,30,0.6)"}`,
                            opacity: isPowered(0.45) ? 1 : 0.15,
                            transform: isPowered(0.45) ? "translateY(0)" : "translateY(30px)",
                            transitionDelay: "0.25s"
                        }}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full" style={{ background: isPowered(0.45) ? "#FFD700" : "#444", boxShadow: isPowered(0.45) ? "0 0 10px #FFD700" : "none" }} />
                                <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(255,215,0,0.6)" }}>GitHub Commits</span>
                            </div>
                            <span className="text-xs" style={{ color: "rgba(100,100,100,0.7)" }}>@{GITHUB_USERNAME}</span>
                        </div>

                        <div style={{ background: "#000", borderRadius: "8px", overflow: "hidden" }}>
                            <img
                                src={`https://ghchart.rshah.org/FFD700/${GITHUB_USERNAME}`}
                                alt="GitHub Contribution Chart"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    display: "block",
                                    mixBlendMode: "darken"
                                }}
                                loading="lazy"
                            />
                        </div>

                        <div className="mt-4 text-center">
                            <a
                                href={`https://github.com/${GITHUB_USERNAME}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs tracking-widest uppercase transition-all duration-300"
                                style={{
                                    color: isPowered(0.45) ? "rgba(255,215,0,0.6)" : "#333",
                                    textDecoration: "none",
                                    border: "1px solid rgba(255,215,0,0.15)"
                                }}
                                onMouseEnter={e => { e.currentTarget.style.color = "#FFD700"; e.currentTarget.style.background = "rgba(255,215,0,0.06)"; }}
                                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,215,0,0.6)"; e.currentTarget.style.background = "transparent"; }}
                            >
                                View Full GitHub Profile →
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
