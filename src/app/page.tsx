import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import Certificates from "@/components/Certificates";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="bg-[#121212]">
      {/* 
        This section is relative so the absolutely-positioned Overlay 
        sits perfectly on top of the ScrollyCanvas.
      */}
      <section id="hero-section" className="relative h-[800vh]">
        <ScrollyCanvas />
        <Overlay />
      </section>

      {/* Certificates 3D scroll section */}
      <Certificates />

      {/* Projects Grid below the scrolly animation */}
      <div className="relative z-20">
        <Projects />
      </div>

      {/* Contact Section */}
      <div className="relative z-30">
        <Contact />
      </div>
    </main>
  );
}
