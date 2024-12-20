import Image from "next/image";
import sponsorsData from "@/public/constants/sponsors/sponsors.json";
import Link from "next/link";
import { headers } from "next/headers";
import { getDictionary } from "@/app/[lang]/dictionaries";

type TSponsor = {
  name: string;
  logo: string;
  url: string;
};

const sponsors: TSponsor[] = sponsorsData;

const SectionSponsors = async () => {
  const heads = headers()
  const lang = heads.get('x-current-lang')
  const t = await getDictionary(lang)
  return (
    <section className="container flex">
      <div className="w-full flex flex-col gap-2 md:flex-row md:justify-between mt-[-0.5px] py-[72px] px-8 md:py-[72px] md:px-10 border-wtf-border-divider border-[0.5px] border-solid">
        <div className="flex flex-col gap-y-2">
          <div className="text-4xl font-bold">{t.index.Sponsors}</div>
          <div className="text-base font-normal">
            {t.index.Sponsor_the_future_of_Web3_ecology}
          </div>
        </div>
        <div className="flex flex-col mt-16 md:mt-0 md:flex-row md:items-center md:gap-16">
          {sponsors.map((sponsor) => (
            <Link href={sponsor.url} key={sponsor.name} className="relative h-[71px] inline-flex items-center w-max">
              <Image src={sponsor.logo} alt={sponsor.name} width={120} height={71} className="object-contain" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionSponsors;
