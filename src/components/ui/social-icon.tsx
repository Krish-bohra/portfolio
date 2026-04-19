import { Button } from "@/components/ui/button";
import { Github, Linkedin, Instagram, Twitter } from "lucide-react";

const ButtonSocialIconDemo = () => {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {/* Twitter */}
      <Button
        variant="outline"
        type="button"
        className="rounded-lg hover:scale-120 transition-all duration-300 cursor-pointer p-3"
        onClick={() => window.open('https://twitter.com', '_blank')}
      >
        <Twitter className="h-6 w-6" />
      </Button>

      {/* Github */}
      <Button
        variant="outline"
        type="button"
        className="rounded-lg hover:scale-120 transition-all duration-300 cursor-pointer p-3"
        onClick={() => window.open('https://github.com/Krish-bohra', '_blank')}
      >
        <Github className="h-6 w-6" />
      </Button>

      {/* Linkedin */}
      <Button
        variant="outline"
        type="button"
        className="rounded-lg hover:scale-120 transition-all duration-300 cursor-pointer p-3"
        onClick={() => window.open('https://www.linkedin.com/in/krish-bohra/', '_blank')}
      >
        <Linkedin className="h-6 w-6 text-blue-500" />
      </Button>

      {/* Instagram */}
      <Button
        variant="outline"
        type="button"
        className="rounded-lg hover:scale-120 transition-all duration-300 cursor-pointer p-3"
        onClick={() => window.open('https://www.instagram.com/itz_krish_bohra', '_blank')}
      >
        <Instagram className="h-6 w-6 text-pink-500" />
      </Button>
    </div>
  );
};

export default ButtonSocialIconDemo;

