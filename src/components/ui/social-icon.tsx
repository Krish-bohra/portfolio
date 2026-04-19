import { Button } from "@/components/ui/button";
import { Github, Linkedin, Instagram, Twitter } from "lucide-react";

const ButtonSocialIconDemo = () => {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {/* Twitter */}
      <Button
        variant="outline"
        type="button"
        className="group flex items-center rounded-lg hover:scale-110 transition-all duration-300 cursor-pointer p-3 overflow-hidden"
        onClick={() => window.open('https://twitter.com', '_blank')}
      >
        <Twitter className="h-6 w-6 shrink-0" />
        <span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:px-1 group-hover:ml-2 transition-all duration-300 ease-out whitespace-nowrap text-sm font-medium">
          Twitter
        </span>
      </Button>

      {/* Github */}
      <Button
        variant="outline"
        type="button"
        className="group flex items-center rounded-lg hover:scale-110 transition-all duration-300 cursor-pointer p-3 overflow-hidden"
        onClick={() => window.open('https://github.com/Krish-bohra', '_blank')}
      >
        <Github className="h-6 w-6 shrink-0" />
        <span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:px-1 group-hover:ml-2 transition-all duration-300 ease-out whitespace-nowrap text-sm font-medium">
          GitHub
        </span>
      </Button>

      {/* Linkedin */}
      <Button
        variant="outline"
        type="button"
        className="group flex items-center rounded-lg hover:scale-110 transition-all duration-300 cursor-pointer p-3 overflow-hidden"
        onClick={() => window.open('https://www.linkedin.com/in/krish-bohra/', '_blank')}
      >
        <Linkedin className="h-6 w-6 text-blue-500 shrink-0" />
        <span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:px-1 group-hover:ml-2 transition-all duration-300 ease-out whitespace-nowrap text-sm font-medium">
          LinkedIn
        </span>
      </Button>

      {/* Instagram */}
      <Button
        variant="outline"
        type="button"
        className="group flex items-center rounded-lg hover:scale-110 transition-all duration-300 cursor-pointer p-3 overflow-hidden"
        onClick={() => window.open('https://www.instagram.com/itz_krish_bohra', '_blank')}
      >
        <Instagram className="h-6 w-6 text-pink-500 shrink-0" />
        <span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:px-1 group-hover:ml-2 transition-all duration-300 ease-out whitespace-nowrap text-sm font-medium">
          Instagram
        </span>
      </Button>
    </div>
  );
};

export default ButtonSocialIconDemo;

