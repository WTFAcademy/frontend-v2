import { Button } from "@/components/ui/button";
import { DiscordLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import React from "react";

const SectionBanner = () => {
  return (
    <section className="h-screen w-full bg-[url('/images/banner.jpeg')] bg-cover bg-center flex flex-col">
      <div className="relative flex flex-col justify-end flex-1 px-4 pb-5 md:px-10 md:pb-10 z-10">
        <div className="absolute top-0 bottom-0 left-0 w-[70%] lg:w-[40%] shrink-0 [background:linear-gradient(90deg,#571B13_0%,rgba(146,66,59,0.00)_100%)]" />
        <div className="relative z-10">
          <h1 className="text-wtf-white font-[900] text-[64px] leading-[100%] md:text-9xl uppercase">
            WTF <br /> ACADEMY
          </h1>
          <div className="text-wtf-white text-sm leading-[18px] md:text-base md:leading-[28px] mt-[14px] max-w-[824px]">
            WTF Academy is an open university focused on Web3 technology, aiming
            to train 100,000 developers. We offer high-quality courses and
            practical projects to help you learn, contribute, and get certified.
            Whether you&apos;re a beginner or an experienced developer, WTF
            Academy provides the cutting-edge knowledge and skills you need to
            succeed in the Web3 world.
          </div>
          <div className="mt-[24px] flex gap-x-4 items-center">
            <Button size="xl">Start Learning</Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 text-wtf-white bg-wtf-black/[.16] border border-solid border-wtf-white hover:bg-wtf-white hover:text-wtf-black"
            >
              <DiscordLogoIcon className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 text-wtf-white bg-wtf-black/[.16] border border-solid border-wtf-white hover:bg-wtf-white hover:text-wtf-black"
            >
              <TwitterLogoIcon className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full h-[54px] flex items-center bg-wtf-black text-wtf-white uppercase font-roboto-mono text-[13px] tracking-[2.86px]">
        {[
          "Web3",
          "Open",
          "University",
          "for",
          "Developers",
          "Educating",
          "100,000",
          "Developers",
          "for",
          "Web3",
        ].map((text, index) => (
          <React.Fragment key={index}>
            <span className="hidden md:block md:flex-grow md:text-center">{text}</span>
            {index < 9 && <span className="hidden md:px-2">·</span>}
          </React.Fragment>
        ))}
        <span className="flex-grow text-center md:hidden">Web3</span>
        <span className="px-2 md:hidden">·</span>
        <span className="flex-grow text-center md:hidden">Open</span>
        <span className="px-2 md:hidden">·</span>
        <span className="flex-grow text-center md:hidden">University</span>
      </div>
    </section>
  );
};

export default SectionBanner;
