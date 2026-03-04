import HeroSection from "@/components/HeroSection";
import TimeLineSection from "@/components/TimelineSection"
import SkillSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectSection";
import ProjectsSection2 from "@/components/ProjectSection2";
import AboutSection from "@/components/AboutMe";
export default function Home() {
  return (
    <main>
      <HeroSection />
      <TimeLineSection />
      <SkillSection />
      <ProjectsSection2 />
      <AboutSection />
    </main>
  );
}
