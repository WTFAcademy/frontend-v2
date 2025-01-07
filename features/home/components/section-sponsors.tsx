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
      <div className="w-full flex flex-col space-y-8 md:space-y-0 md:flex-row mt-[-0.5px] border-wtf-border-divider border-[0.5px] border-solid">
        <div className="flex flex-col gap-y-2 w-full pb-8 pt-16 pl-8 md:pl-10 md:w-[33.3%] justify-center">
          <div className="text-4xl font-bold min-w-[170px]">{t.index.Sponsors}</div>
          <div className="text-base font-normal">
            {t.index.Sponsor_the_future_of_Web3_ecology}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-0 w-full mt-0 md:w-[66.7%] lg:grid-cols-3 xl:grid-cols-4 !mb-[-0.5px]">
          {sponsors.map((sponsor) => (
            <Link 
              href={sponsor.url} 
              key={sponsor.name} 
              className="relative h-[120px] flex items-center justify-center p-4 border-wtf-border-divider border-[0.5px] border-solid ml-[-0.5px] mt-[-0.5px] hover:opacity-80"
            >
              <Image 
                src={theme === "dark" ? sponsor.logo_dark : sponsor.logo} 
                alt={sponsor.name} 
                width={120} 
                height={40} 
                className="object-contain" 
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionSponsors;
