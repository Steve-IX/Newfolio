import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Achievements from "@/components/Achievements";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Dissertation from "@/components/Dissertation";
import Skills from "@/components/Skills";
import CodeLab from "@/components/CodeLab";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function Home() {
  return (
    <main className="relative">
      <InteractiveBackground />
      <Navigation />
      <Hero />
      <About />
      <Achievements />
      <Experience />
      <Projects />
      <Dissertation />
      <Skills />
      <CodeLab />
      <Contact />
      <Footer />
      <MusicPlayer />
    </main>
  );
}
