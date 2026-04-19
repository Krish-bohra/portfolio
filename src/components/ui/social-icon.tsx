import { Button } from "@/components/ui/button";

const ButtonSocialIconDemo = () => {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {/* discord */}
      <Button
        variant="outline"
        type="button"
        className="rounded-lg hover:scale-120 transition-all duration-300 cursor-pointer"
      >
        <img
          src="https://images.shadcnspace.com/assets/svgs/icon-discord.svg"
          alt="discord icon"
          className="h-4 w-4"
        />
      </Button>
      {/* github */}
      <Button
        variant="outline"
        type="button"
        className="rounded-lg hover:scale-120 transition-all duration-300 cursor-pointer"
      >
        <img
          src="https://images.shadcnspace.com/assets/svgs/icon-github.svg"
          alt="github icon"
          className="dark:hidden h-4 w-4"
        />
        <img
          src="https://images.shadcnspace.com/assets/svgs/icon-github-white.svg"
          alt="github icon"
          className="hidden dark:block h-4 w-4"
        />
      </Button>
      {/* linkedin */}
      <Button
        variant="outline"
        type="button"
        className="rounded-lg hover:scale-120 transition-all duration-300 cursor-pointer"
      >
        <img
          src="https://images.shadcnspace.com/assets/svgs/icon-linkedin.svg"
          alt="linkedin icon"
          className="h-4 w-4"
        />
      </Button>
      {/* instagram */}
      <Button
        variant="outline"
        type="button"
        className="rounded-lg hover:scale-120 transition-all duration-300 cursor-pointer"
      >
        <img
          src="https://images.shadcnspace.com/assets/svgs/icon-instagram.svg"
          alt="instagram icon"
          className="h-4 w-4"
        />
      </Button>
    </div>
  );
};

export default ButtonSocialIconDemo;
