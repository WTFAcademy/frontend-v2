"use client";

import Image from "next/image";
import sponsorsData from "@/public/constants/sponsors/sponsors.json";
import Link from "next/link";
import { useDictionary } from "@/features/lang";
import { useTheme } from "next-themes";

type TSponsor = {
  name: string;
  logo: string;
  logo_dark: string;
  url: string;
};

const sponsors: TSponsor[] = sponsorsData;

const SectionSponsors = () => {
  const t = useDictionary();
  const { theme } = useTheme();
  return (
    <section className="container flex">
      <div className="w-full flex flex-col gap-2 lg:flex-row lg:justify-between mt-[-0.5px] py-[72px] px-8 lg:py-[72px] lg:px-10 border-wtf-border-divider border-[0.5px] border-solid">
        <div className="flex flex-col gap-y-2">
          <div className="text-4xl font-bold min-w-[170px]">{t.index.Sponsors}</div>
          <div className="text-base font-normal">
            {t.index.Sponsor_the_future_of_Web3_ecology}
          </div>
        </div>
        <div className="flex flex-col mt-16 lg:mt-0 lg:flex-row lg:items-center lg:gap-12 items-center">
          {sponsors.map((sponsor) => (
            <Link href={sponsor.url} key={sponsor.name} className="relative h-[71px] inline-flex items-center w-max">
              <Image src={theme === "dark" ? sponsor.logo_dark : sponsor.logo} alt={sponsor.name} width={120} height={71} className="object-contain" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionSponsors;
