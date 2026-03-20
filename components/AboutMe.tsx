"use client";

import { useEffect, useRef, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";

const PersonIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
);

const MailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
    </svg>
);

const LinkIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
);

const CommitIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
        <circle cx="12" cy="12" r="3" />
        <line x1="3" y1="12" x2="9" y2="12" />
        <line x1="15" y1="12" x2="21" y2="12" />
    </svg>
);

const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.02 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.28-1.28a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
);

const DownloadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const ExternalIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
);

const SOCIALS = [
    {
        name: "GitHub",
        url: "https://github.com/ujjawal8461",
        icon: (<svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 26, height: 26 }}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>),
    },
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/ujjawal-singh-solanki/",
        icon: (<svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 26, height: 26 }}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>),
    },
    {
        name: "Twitter",
        url: "https://x.com/Ujjawal_Singh11",
        icon: (<svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 26, height: 26 }}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>),
    },
    {
        name: "Instagram",
        url: "https://instagram.com/ujjawal_singh_11",
        icon: (<svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 26, height: 26 }}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>),
    },
    {
        name: "HackerRank",
        url: "https://www.hackerrank.com/profile/ujjawal8461",
        icon: (<svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 26, height: 26 }}><path fillRule="evenodd" clipRule="evenodd" d="M11.954 13.593v-3.235h7.324v3.235h-7.324zM16.483 4.228h-3.327v4.614h3.327V4.228zM7.514 4.228H4.188v15.54h3.326V4.228zM16.483 15.15h-3.327v4.618h3.327V15.15zM23.996 11.979C24 5.361 18.636 0 12 0 5.36 0 0 5.361 0 11.98S5.361 24 12 24c6.637 0 11.996-5.362 11.996-12.021zM2.809 11.98c0 5.071 4.108 9.178 9.18 9.178 5.074 0 9.182-4.107 9.182-9.178 0-5.073-4.108-9.182-9.182-9.182-5.072 0-9.18 4.109-9.18 9.182z" /></svg>),
    }
    // {
    //     name: "LeetCode",
    //     url: "https://leetcode.com/u/ujjawal_singh_solanki/",
    //     icon: (<svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 26, height: 26 }}><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" /></svg>),
    // }
];

function SectionLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ color: "rgba(255,215,0,0.7)", display: "flex", alignItems: "center" }}>{icon}</span>
            <span style={{ fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,215,0,0.6)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
                {text}
            </span>
        </div>
    );
}

export default function AboutSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // On mobile always treat everything as powered so content is always visible
    const isPowered = (threshold: number) => isMobile ? true : scrollProgress > threshold;

    useEffect(() => {
        setMounted(true);
        const checkSize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };
        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);

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
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const copyEmail = () => {
        if (typeof window === "undefined") return;
        navigator.clipboard.writeText("ujjawalsinghsolanki1112@gmail.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Responsive calendar block size
    const calendarBlockSize = isMobile ? 8 : isTablet ? 10 : 13;
    const calendarBlockMargin = isMobile ? 3 : isTablet ? 4 : 5;
    const calendarFontSize = isMobile ? 10 : isTablet ? 12 : 14;

    const cards = (
        <>
            {/* BIO + CONTACT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">

                {/* Bio card */}
                <div
                    className="rounded-2xl p-4 md:p-5 transition-all duration-700"
                    style={{
                        border: `1px solid ${isPowered(0.05) ? "rgba(255,215,0,0.25)" : "rgba(40,40,40,0.6)"}`,
                        opacity: isPowered(0.05) ? 1 : 0.3,
                        transform: isPowered(0.05) ? "translateY(0)" : "translateY(20px)"
                    }}
                >
                    <SectionLabel icon={<PersonIcon />} text="Who I Am" />
                    <h3 className="font-bold mb-0.5" style={{ fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: isPowered(0.03) ? "#FFD700" : "#333", fontFamily: "system-ui" }}>
                        Ujjawal Singh Solanki
                    </h3>
                    <p className="mb-2" style={{ fontSize: "0.8rem", color: "rgba(255,215,0,0.5)" }}>Full-Stack Developer · Indore, India</p>
                    <p style={{ fontSize: "0.8rem", lineHeight: 1.65, color: isPowered(0.03) ? "rgba(200,200,200,0.85)" : "#333" }}>
                        I'm a 23 year old Software Engineer with 2 years of experience in the MERN stack. I enjoy building web applications and working through the challenges that come with creating real products. I'm passionate about creativity and use web development to turn ideas into real applications.
                    </p>
                    <div className="flex flex-wrap gap-4 mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,215,0,0.1)" }}>
                        {[["B.Tech", "CS · CDGI"], ["2022", "PW Intern"], ["2024", "Dexbytes"]].map(([label, sub]) => (
                            <div key={label}>
                                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: isPowered(0.03) ? "#FFD700" : "#333" }}>{label}</div>
                                <div style={{ fontSize: "0.72rem", color: "rgba(150,150,150,0.7)" }}>{sub}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact card */}
                <div
                    className="rounded-2xl p-4 md:p-5 transition-all duration-700"
                    style={{
                        border: `1px solid ${isPowered(0.25) ? "rgba(255,215,0,0.25)" : "rgba(40,40,40,0.6)"}`,
                        opacity: isPowered(0.25) ? 1 : 0.3,
                        transform: isPowered(0.25) ? "translateY(0)" : "translateY(20px)",
                        transitionDelay: "0.08s"
                    }}
                >
                    <SectionLabel icon={<MailIcon />} text="Reach Me" />
                    <div className="flex flex-col gap-2 mb-3">
                        <button
                            onClick={copyEmail}
                            className="flex items-center gap-3 w-full rounded-xl px-3 py-2 text-left transition-all duration-300"
                            style={{ background: "rgba(255,215,0,0.04)", border: "1px solid rgba(255,215,0,0.12)", cursor: "pointer" }}
                        >
                            <span style={{ color: "rgba(255,215,0,0.7)", flexShrink: 0 }}><MailIcon /></span>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: "10px", color: "rgba(150,150,150,0.7)" }}>Email</div>
                                <div style={{ fontSize: "0.8rem", fontWeight: 500, color: isPowered(0.03) ? "rgba(255,215,0,0.9)" : "#444", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {copied ? "Copied! ✓" : "ujjawalsinghsolanki1112@gmail.com"}
                                </div>
                            </div>
                        </button>
                        <div className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: "rgba(255,215,0,0.04)", border: "1px solid rgba(255,215,0,0.12)" }}>
                            <span style={{ color: "rgba(255,215,0,0.7)", flexShrink: 0 }}><PhoneIcon /></span>
                            <div>
                                <div style={{ fontSize: "10px", color: "rgba(150,150,150,0.7)" }}>Phone</div>
                                <div style={{ fontSize: "0.8rem", fontWeight: 500, color: isPowered(0.03) ? "rgba(255,215,0,0.9)" : "#444" }}>+91 84618 26896</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 pt-3" style={{ borderTop: "1px solid rgba(255,215,0,0.08)" }}>
                        <a href="/resume.pdf" download
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold tracking-widest uppercase transition-all duration-300 flex-1"
                            style={{ background: "rgba(255,215,0,0.08)", border: "2px solid rgba(255,215,0,0.7)", color: "#FFD700", textDecoration: "none", fontSize: "10px", whiteSpace: "nowrap" }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 30px rgba(255,215,0,0.35)"; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
                        >
                            <DownloadIcon /> Download Resume
                        </a>
                        <a href="resume.pdf" target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold tracking-widest uppercase transition-all duration-300 flex-1"
                            style={{ border: "2px solid rgba(255,215,0,0.3)", color: "rgba(255,215,0,0.8)", textDecoration: "none", fontSize: "10px", whiteSpace: "nowrap" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,215,0,0.06)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                        >
                            <ExternalIcon /> View Resume
                        </a>
                    </div>
                </div>
            </div>

            {/* SOCIALS */}
            <div
                className="rounded-2xl p-4 transition-all duration-700"
                style={{
                    border: `1px solid ${isPowered(0.50) ? "rgba(255,215,0,0.2)" : "rgba(30,30,30,0.6)"}`,
                    opacity: isPowered(0.50) ? 1 : 0.2,
                    transform: isPowered(0.50) ? "translateY(0)" : "translateY(30px)",
                    transitionDelay: "0.12s"
                }}
            >
                <SectionLabel icon={<LinkIcon />} text="Find Me Online" />
                <div className="grid grid-cols-5 gap-2">
                    {SOCIALS.map((social, i) => (
                        <a key={i} href={social.url} target="_blank" rel="noopener noreferrer"
                            className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-300"
                            style={{
                                background: hoveredSocial === i ? "rgba(255,215,0,0.07)" : "transparent",
                                border: `1px solid ${hoveredSocial === i ? "rgba(255,215,0,0.45)" : "rgba(255,215,0,0.1)"}`,
                                textDecoration: "none",
                                transform: hoveredSocial === i ? "translateY(-3px) scale(1.04)" : "none",
                                boxShadow: hoveredSocial === i ? "0 6px 18px rgba(255,215,0,0.12)" : "none"
                            }}
                            onMouseEnter={() => setHoveredSocial(i)}
                            onMouseLeave={() => setHoveredSocial(null)}
                        >
                            <span style={{ color: "rgba(255,215,0,0.75)" }}>{social.icon}</span>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,215,0,0.7)" }}>{social.name}</span>
                        </a>
                    ))}
                </div>
            </div>

            {/* GITHUB CALENDAR */}
            <div
                className="rounded-2xl p-4 transition-all duration-700"
                style={{
                    border: `1px solid ${isPowered(0.75) ? "rgba(255,215,0,0.2)" : "rgba(30,30,30,0.6)"}`,
                    opacity: isPowered(0.75) ? 1 : 0.1,
                    transform: isPowered(0.75) ? "translateY(0)" : "translateY(40px)",
                    transitionDelay: "0.18s"
                }}
            >
                <SectionLabel icon={<CommitIcon />} text="GitHub Commits" />
                {/* Scrollable wrapper so calendar is never clipped */}
                <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" as any, paddingBottom: "4px" }}>
                    {mounted && (
                        <GitHubCalendar
                            username="ujjawal8461"
                            blockSize={calendarBlockSize}
                            blockMargin={calendarBlockMargin}
                            fontSize={calendarFontSize}
                            colorScheme="dark"
                            theme={{
                                dark: [
                                    "rgba(70, 70, 70, 0.25)",
                                    "rgba(255,215,0,0.35)",
                                    "rgba(255,215,0,0.55)",
                                    "rgba(255,215,0,0.75)",
                                    "rgba(255,215,0,1)"
                                ]
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    );

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-black"
            style={{ minHeight: isMobile ? "auto" : "200vh" }}
        >
            {isMobile ? (
                /* ── Mobile: plain scrollable layout, no sticky ── */
                <div className="flex flex-col items-center py-10 px-4">
                    <h2
                        className="text-center font-bold tracking-[0.3em] uppercase mb-6"
                        style={{
                            fontSize: "clamp(1.6rem, 7vw, 2.2rem)",
                            color: "#FFD700",
                            textShadow: "0 0 60px rgba(255,215,0,0.5)",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                    >
                        ABOUT ME
                    </h2>
                    <div className="w-full max-w-lg flex flex-col gap-4">
                        {cards}
                    </div>
                </div>
            ) : (
                /* ── Tablet/Desktop: sticky scroll-driven layout ── */
                <div
                    className="sticky top-0 h-screen flex flex-col items-center justify-center py-6 px-4 md:px-6"
                    style={{ zIndex: 2 }}
                >
                    <h2
                        className="text-center font-bold tracking-[0.3em] uppercase mb-4"
                        style={{
                            fontSize: "clamp(1.8rem, 4vw, 3rem)",
                            color: isPowered(0.03) ? "#FFD700" : "#333",
                            textShadow: isPowered(0.03) ? "0 0 60px rgba(255,215,0,0.5), 0 0 120px rgba(255,215,0,0.2)" : "none",
                            transition: "all 0.6s ease",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            flexShrink: 0,
                        }}
                    >
                        ABOUT ME
                    </h2>
                    <div className="w-full max-w-5xl flex flex-col gap-3 md:gap-4">
                        {cards}
                    </div>
                </div>
            )}
        </section>
    );
}