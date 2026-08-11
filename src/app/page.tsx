 import Hero from "@/sections/Hero/Hero";
import HeadLine from "@/sections/HeadLine/HeadLine";
import About from "@/sections/About/About";
import BeforeProjects from "@/sections/BeforeProjects/BeforeProjects";
import Projects from "@/sections/Projects/Projects";
import Skills from "@/sections/Skills/Skills";
import LetsTalk from "@/sections/LetsTalk/LetsTalk";
 

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HeadLine />
      <About />
      <BeforeProjects />
      <Projects />
      <Skills />
      <LetsTalk />
       
    </main>
  );
}