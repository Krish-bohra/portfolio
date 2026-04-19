import { Button } from "@/components/ui/button";
import { Github, Linkedin, Instagram, Twitter } from "lucide-react";

const ButtonSocialIconDemo = () => {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {/* Twitter */}
      <Button
        variant="outline"
        type="button"
        className="rounded-lg hover:scale-120 transition-all duration-300 cursor-pointer p-2"
        onClick={() => window.open('https://twitter.com', '_blank')}
      >
        <Twitter className="h-4 w-4" />
      </Button>

      {/* Github */}
      <Button
        variant="outline"
        type="button"
        className="rounded-lg hover:scale-120 transition-all duration-300 cursor-pointer p-2"
        onClick={() => window.open('https://github.com/Krish-bohra', '_blank')}
      >
        <Github className="h-4 w-4" />
      </Button>

      {/* Linkedin */}
      <Button
        variant="outline"
        type="button"
        className="rounded-lg hover:scale-120 transition-all duration-300 cursor-pointer p-2"
        onClick={() => window.open('https://linkedin.com', '_blank')}
      >
        <Linkedin className="h-4 w-4 text-blue-500" />
      </Button>

      {/* Instagram */}
      <Button
        variant="outline"
        type="button"
        className="rounded-lg hover:scale-120 transition-all duration-300 cursor-pointer p-2"
        onClick={() => window.open('https://instagram.com', '_blank')}
      >
        <Instagram className="h-4 w-4 text-pink-500" />
      </Button>
    </div>
  );
};

export default ButtonSocialIconDemo;

