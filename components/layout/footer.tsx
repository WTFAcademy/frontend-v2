"use client";

import { DiscordLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import TextBorderAnimation from "../animata/text/text-border-animation";
import Link, { LinkProps } from "next/link";
import { useDictionary } from "@/features/lang";
import { Icons } from "../icons";
import {
  DISCORD_URL,
  FORUM_URL,
  GITHUB_URL,
  MIRROR_URL,
  TWITTER_URL,
  WECHAT_URL,
} from "@/features/home/constants";

const FooterLink = ({
  text,
  ...props
}: { text: string } & LinkProps & { target?: string }) => {
  return (
    <Link {...props}>
      <TextBorderAnimation
        text={text}
        className="text-base font-semibold leading-6"
      />
    </Link>
  );
};

const Footer = () => {
  const t = useDictionary();
  return (
    <footer className="w-full bg-wtf-background-footer">
      <div className="container">
        <div className="w-full flex flex-col md:flex-row border-wtf-border-divider border-x-[0.5px] border-b-[0.5px] border-solid">
          <div className="flex-grow-[2] flex flex-col gap-y-2 items-center justify-center px-10 py-[53px] border-wtf-border-divider border-r-[0.5px] border-b-[0.5px] md:border-b-0 border-solid">
            <div className="relative h-[94px] w-[252px]">
              <Image
                src="/svgs/logo.svg"
                alt="WTF Academy"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex items-center gap-x-4">
              <Link href={DISCORD_URL} target="_blank" className="flex items-center justify-center rounded-full bg-wtf-content-1 w-8 h-8 transition-colors hover:bg-wtf-content-2">
                <DiscordLogoIcon className="text-wtf-content-inverted w-4 h-4" />
              </Link>
              <Link href={TWITTER_URL} target="_blank" className="flex items-center justify-center rounded-full bg-wtf-content-1 w-8 h-8 transition-colors hover:bg-wtf-content-2">
                <Icons.twitter className="text-wtf-content-inverted w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="flex-grow flex flex-col p-10 border-wtf-border-divider border-r-[0.5px] border-b-[0.5px] md:border-b-0 border-solid gap-y-4">
            <div className="text-base font-medium leading-6 text-wtf-content-3">
              {t.index.Products}
            </div>
            <div className="flex flex-col gap-y-2 text-wtf-content-1 text-base font-semibold leading-6">
              <FooterLink href="/course" text={t.index.Courses} />
              <FooterLink
                href={FORUM_URL}
                target="_blank"
                text={t.index.Forum}
              />
            </div>
          </div>
          <div className="flex-grow flex flex-col p-10 border-wtf-border-divider border-r-[0.5px] border-b-[0.5px] md:border-b-0 border-solid gap-y-4">
            <div className="text-base font-medium leading-6 text-wtf-content-3">
              {t.index.Community}
            </div>
            <div className="flex flex-col gap-y-2 text-wtf-content-1 text-base font-semibold leading-6">
              <FooterLink href={GITHUB_URL} target="_blank" text="GitHub" />
              <FooterLink href={DISCORD_URL} target="_blank" text="Discord" />
              <FooterLink href={TWITTER_URL} target="_blank" text="Twitter" />
              <FooterLink href={WECHAT_URL} target="_blank" text="WeChat" />
            </div>
          </div>
          <div className="flex-grow flex flex-col p-10 border-wtf-border-divider border-r-[0.5px] border-b-[0.5px] border-solid gap-y-4">
            <div className="text-base font-medium leading-6 text-wtf-content-3">
              {t.index.Donation}
            </div>
            <div className="flex flex-col gap-y-2 text-wtf-content-1 text-base font-semibold leading-6">
              <FooterLink href={MIRROR_URL} target="_blank" text="Mirror" />
            </div>
          </div>
        </div>
        <div className="flex gap-y-2 flex-col md:flex-row justify-between items-center px-10 py-6 text-xs font-normal leading-4 text-wtf-content-3">
          <span>{t.index.Web3_Open_University_for_Developers}</span>
          <span>©2024 WTF Academy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
