"use client";

import BoxReveal from "@/components/animata/box-reveal";
import { Button } from "@/components/ui/button";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import React from "react";
import { useDictionary } from "@/features/lang";
import Link from "next/link";
import { DISCORD_URL, TWITTER_URL } from "../constants";
import { Icons } from "@/components/icons";

const SectionBanner = () => {
  const t = useDictionary();
  return (
    <section className="h-screen w-full bg-[url('/images/banner.jpeg')] bg-cover bg-center flex flex-col">
      <div className="relative flex flex-col justify-end flex-1 px-4 pb-5 md:px-10 md:pb-10 z-10">
        <div className="absolute top-0 bottom-0 left-0 w-[70%] lg:w-[40%] shrink-0 [background:linear-gradient(90deg,#571B13_0%,rgba(146,66,59,0.00)_100%)]" />
        <div className="container relative z-10">
          <BoxReveal duration={0.2} bgClassName="bg-wtf-background-navbar">
            <h1 className="text-white font-[900] text-[64px] leading-[100%] md:text-9xl uppercase">
              WTF
            </h1>
          </BoxReveal>
          <BoxReveal duration={0.2} bgClassName="bg-wtf-background-navbar">
            <h1 className="text-white font-[900] text-[64px] leading-[100%] md:text-9xl uppercase">
              ACADEMY
            </h1>
          </BoxReveal>
          <BoxReveal duration={0.2} bgClassName="bg-wtf-background-navbar">
            <div className="text-white text-sm leading-[18px] md:text-base md:leading-[28px] mt-[14px] max-w-[824px]">
              {t.index.banner_desc}
            </div>
          </BoxReveal>

          <BoxReveal duration={0.2}>
            <div className="mt-[24px] flex gap-x-4 items-center">
              <Link href="/course">
                <Button size="xl" className="rounded-full">
                  {t.index.Start_Learning}
                </Button>
              </Link>
              <Link href={DISCORD_URL} target="_blank">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 text-white bg-black/[.16] border border-solid border-white hover:bg-white hover:text-black rounded-full"
                >
                  <DiscordLogoIcon className="w-6 h-6" />
                </Button>
              </Link>
              <Link href={TWITTER_URL} target="_blank">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 text-white bg-black/[.16] border border-solid border-white hover:bg-white hover:text-black rounded-full"
                >
                  <Icons.twitter className="w-6 h-6" />
                </Button>
              </Link>
            </div>
          </BoxReveal>
        </div>
      </div>
      <div className="w-full bg-black">
        <div className="container w-full h-[54px] flex items-center justify-around text-white uppercase font-roboto-mono text-[13px] tracking-[2.86px] overflow-hidden select-none">
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
              <BoxReveal
                duration={0.2}
                bgClassName="bg-wtf-background-navbar"
                className="hidden text-center md:inline-block flex-grow transition-all duration-300 hover:text-wtf-orange hover:scale-110"
              >
                <span>{text}</span>
              </BoxReveal>

              {index < 9 && (
                <div className="hidden md:inline-block md:px-2">·</div>
              )}
            </React.Fragment>
          ))}
          <BoxReveal duration={0.2} bgClassName="bg-wtf-background-navbar">
            <span className="flex-grow text-center md:hidden">Web3</span>
          </BoxReveal>
          <span className="px-2 md:hidden">·</span>
          <BoxReveal duration={0.2} bgClassName="bg-wtf-background-navbar">
            <span className="flex-grow text-center md:hidden">Open</span>
          </BoxReveal>
          <span className="px-2 md:hidden">·</span>
          <BoxReveal duration={0.2} bgClassName="bg-wtf-background-navbar">
            <span className="flex-grow text-center md:hidden">University</span>
          </BoxReveal>
        </div>
      </div>
    </section>
  );
};

export default SectionBanner;
