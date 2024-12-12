"use client";

import { DiscordLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import TextBorderAnimation from "../animata/text/text-border-animation";
import Link, { LinkProps } from "next/link";
import { useDictionary } from "@/features/lang";

const FooterLink = ({ text, ...props }: { text: string } & LinkProps) => {
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
              <div className="flex items-center justify-center rounded-full bg-wtf-content-1 w-8 h-8">
                <DiscordLogoIcon className="text-wtf-content-inverted w-4 h-4" />
              </div>
              <div className="flex items-center justify-center rounded-full bg-wtf-content-1 w-8 h-8">
                <TwitterLogoIcon className="text-wtf-content-inverted w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="flex-grow flex flex-col p-10 border-wtf-border-divider border-r-[0.5px] border-b-[0.5px] md:border-b-0 border-solid gap-y-4">
            <div className="text-base font-medium leading-6 text-wtf-content-3">
              {t.index.Products}
            </div>
            <div className="flex flex-col gap-y-2 text-wtf-content-1 text-base font-semibold leading-6">
              <FooterLink href="/learning-center" text={t.index.Learning_Center} />
              <FooterLink href="/learning-center" text={t.index.Courses} />
              <FooterLink href="/learning-center" text={t.index.Forum} />
            </div>
          </div>
          <div className="flex-grow flex flex-col p-10 border-wtf-border-divider border-r-[0.5px] border-b-[0.5px] md:border-b-0 border-solid gap-y-4">
            <div className="text-base font-medium leading-6 text-wtf-content-3">
              {t.index.Community}
            </div>
            <div className="flex flex-col gap-y-2 text-wtf-content-1 text-base font-semibold leading-6">
              <FooterLink href="/learning-center" text="GitHub" />
              <FooterLink href="/learning-center" text="Discord" />
              <FooterLink href="/learning-center" text="Twitter" />
              <FooterLink href="/learning-center" text="WeChat" />
            </div>
          </div>
          <div className="flex-grow flex flex-col p-10 border-wtf-border-divider border-r-[0.5px] border-b-[0.5px] border-solid gap-y-4">
            <div className="text-base font-medium leading-6 text-wtf-content-3">
              {t.index.Donation}
            </div>
            <div className="flex flex-col gap-y-2 text-wtf-content-1 text-base font-semibold leading-6">
              <FooterLink href="/learning-center" text="GitHub" />
              <FooterLink href="/learning-center" text="Mirror" />
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
