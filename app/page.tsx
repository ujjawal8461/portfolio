import HeroSection from "@/components/HeroSection";
import TimeLineSection from "@/components/TimelineSection"
import SkillSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TimeLineSection />
      <SkillSection />
      <ProjectsSection />
    </main>
  );
}
