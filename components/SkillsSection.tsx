"use client";

import { useEffect, useRef, useState } from "react";

export default function GridGlowSkills() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const skillCategories = [
        {
            id: 1,
            category: "Programming Languages",
            skills: ["C", "C++", "JavaScript", "TypeScript"]
        },
        {
            id: 2,
            category: "Frontend Development",
            skills: ["HTML", "CSS", "Sass", "Tailwind CSS", "Bootstrap", "React.js", "Next.js", "Redux", "Redux Toolkit", "Material UI"]
        },
        {
            id: 3,
            category: "Backend Development",
            skills: ["Node.js", "Express.js", "REST API", "GraphQL", "JWT Authentication", "Swagger"]
        },
        {
            id: 4,
            category: "Databases",
            skills: ["MySQL", "MongoDB", "PostgreSQL", "Mongoose", "Knex.js"]
        },
        {
            id: 5,
            category: "Full Stack Framework",
            skills: ["MERN Stack"]
        },
        {
            id: 6,
            category: "Tools & Platforms",
            skills: ["VS Code", "Postman", "Git", "GitHub", "Bitbucket", "Jira", "Android Studio", "Figma", "Canva", "Vercel"]
        }
    ];

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const handleScroll = () => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top <= 0 && rect.bottom > windowHeight) {
                const scrolledPastTop = -rect.top;
                const sectionScrollHeight = rect.height - windowHeight;
                const progress = Math.max(0, Math.min(1, scrolledPastTop / sectionScrollHeight));
                setScrollProgress(progress);
            } else if (rect.top > 0) {
                setScrollProgress(0);
            } else if (rect.bottom <= windowHeight) {
                setScrollProgress(1);
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const isCardActive = (index: number) => {
        const cardProgress = (index + 1) / skillCategories.length;
        return scrollProgress >= cardProgress * 0.8;
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-black"
            style={{ height: "250vh" }}
        >
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center py-8 px-4">
                <h2
                    className="text-center text-5xl md:text-6xl font-bold mb-16 tracking-[0.25em] uppercase"
                    style={{
                        color: scrollProgress > 0.05 ? "#FFD700" : "#888",
                        textShadow: scrollProgress > 0.05 ? "0 0 50px rgba(255,215,0,0.5)" : "none",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        fontFamily: "system-ui, -apple-system, sans-serif"
                    }}
                >
                    SKILLS
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
                    {skillCategories.map((category, index) => {
                        const isActive = isCardActive(index);
                        const intensity = isActive ? 1 : 0;

                        return (
                            <div
                                key={category.id}
                                className="relative"
                                style={{
                                    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                                    transitionDelay: `${index * 0.1}s`
                                }}
                            >
                                {/* Glow effect */}
                                {isActive && (
                                    <div
                                        className="absolute inset-0 rounded-lg"
                                        style={{
                                            background: `radial-gradient(circle at center, rgba(255, 215, 0, ${intensity * 0.15}), transparent 70%)`,
                                            filter: `blur(20px)`,
                                            transform: `scale(1.1)`,
                                            animation: "pulse 3s ease-in-out infinite"
                                        }}
                                    />
                                )}

                                {/* Card */}
                                <div
                                    className="relative p-6 rounded-lg overflow-hidden"
                                    style={{
                                        backgroundColor: isActive ? "rgba(255, 215, 0, 0.05)" : "rgba(20, 20, 20, 0.5)",
                                        border: `2px solid ${isActive ? `rgba(255, 215, 0, ${intensity * 0.5})` : "rgba(50, 50, 50, 0.3)"}`,
                                        boxShadow: isActive ?
                                            `0 0 30px rgba(255, 215, 0, ${intensity * 0.3}), inset 0 0 30px rgba(255, 215, 0, ${intensity * 0.1})` :
                                            "none",
                                        transition: "all 0.6s ease",
                                        minHeight: "200px"
                                    }}
                                >
                                    {/* Animated border effect */}
                                    {isActive && (
                                        <div
                                            className="absolute inset-0 rounded-lg"
                                            style={{
                                                background: `linear-gradient(90deg, 
                                                    transparent, 
                                                    rgba(255, 215, 0, ${intensity * 0.3}), 
                                                    transparent)`,
                                                animation: "shimmer 3s ease-in-out infinite"
                                            }}
                                        />
                                    )}

                                    <div className="relative z-10">
                                        <h3
                                            className="text-xl font-bold mb-4 tracking-wider"
                                            style={{
                                                color: isActive ? "#FFD700" : "#666",
                                                textShadow: isActive ? `0 0 20px rgba(255, 215, 0, ${intensity * 0.6})` : "none",
                                                transition: "all 0.4s ease",
                                                fontFamily: "system-ui, -apple-system, sans-serif"
                                            }}
                                        >
                                            {category.category}
                                        </h3>

                                        <div className="flex flex-wrap gap-2">
                                            {category.skills.map((skill, skillIndex) => (
                                                <span
                                                    key={skillIndex}
                                                    className="text-sm px-3 py-1.5 rounded-md"
                                                    style={{
                                                        backgroundColor: isActive ? "rgba(255, 215, 0, 0.2)" : "rgba(100, 100, 100, 0.2)",
                                                        color: isActive ? "rgba(255, 245, 200, 0.95)" : "#888",
                                                        border: `1px solid ${isActive ? "rgba(255, 215, 0, 0.4)" : "rgba(100, 100, 100, 0.3)"}`,
                                                        transition: "all 0.4s ease",
                                                        transitionDelay: `${skillIndex * 0.05}s`,
                                                        boxShadow: isActive ? `0 0 10px rgba(255, 215, 0, ${intensity * 0.2})` : "none",
                                                        fontFamily: "system-ui, -apple-system, sans-serif"
                                                    }}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Corner accent */}
                                    {isActive && (
                                        <>
                                            <div
                                                className="absolute top-0 left-0 w-8 h-8"
                                                style={{
                                                    background: `linear-gradient(135deg, rgba(255, 215, 0, ${intensity * 0.5}), transparent)`,
                                                    borderTopLeftRadius: "8px"
                                                }}
                                            />
                                            <div
                                                className="absolute bottom-0 right-0 w-8 h-8"
                                                style={{
                                                    background: `linear-gradient(-45deg, rgba(255, 215, 0, ${intensity * 0.5}), transparent)`,
                                                    borderBottomRightRadius: "8px"
                                                }}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div
                    className="text-center text-xs tracking-[0.35em] uppercase mt-12"
                    style={{
                        color: scrollProgress < 0.95 ? "#555" : "#222",
                        opacity: scrollProgress < 0.95 ? 0.7 : 0,
                        transition: "all 0.5s ease",
                        fontFamily: "system-ui, -apple-system, sans-serif"
                    }}
                >
                    Scroll to charge up • Watch skills illuminate
                </div>

                <style jsx>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 0.8; }
                        50% { opacity: 1; }
                    }
                    
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                `}</style>
            </div>
        </section>
    );
}