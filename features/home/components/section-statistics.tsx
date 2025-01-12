import Ticker from "@/components/animata/text/ticker";
import { Skeleton as SkeletonUI } from "@/components/ui/skeleton";
import { getWtfStats } from "../api/use-get-stats";
import { get } from "lodash-es";
import { headers } from "next/headers";
import { getDictionary } from "@/app/[lang]/dictionaries";

const SectionStatistics = async () => {
  const data = await getWtfStats();

  // DEV: switch language in server component
  const heads = headers()
  const lang = heads.get('x-current-lang')
  const t = await getDictionary(lang)

  const learnerCount = get(data, "data.learners", 0);
  const contributorCount = get(data, "data.contributors", 0);
  const starCount = get(data, "data.stars", 0);
  const bonusAmount = get(data, "data.bonus", 0);

  return (
    <section className="container flex flex-col md:flex-row">
      <div className="flex-1 px-8 py-10 md:px-10 md:py-16 flex flex-col gap-1.5 border-wtf-border-divider mr-[-0.5px] border-[0.5px] border-solid">
        <div className="text-xl font-medium leading-none">{t.index.Learners}</div>
        <div className="text-[44px] font-bold leading-none inline-flex items-center">
          <Ticker value={new Intl.NumberFormat().format(learnerCount)} />+
        </div>
      </div>
      <div className="flex-1 px-8 py-10 md:px-10 md:py-16 flex flex-col gap-1.5 border-wtf-border-divider mr-[-0.5px] border-[0.5px] border-solid">
        <div className="text-xl font-medium leading-none">{t.index.Contributors}</div>
        <div className="text-[44px] font-bold leading-none inline-flex items-center">
          <Ticker value={new Intl.NumberFormat().format(contributorCount)} />+
        </div>
      </div>
      <div className="flex-1 px-8 py-10 md:px-10 md:py-16 flex flex-col gap-1.5 border-wtf-border-divider mr-[-0.5px] border-[0.5px] border-solid">
        <div className="text-xl font-medium leading-none">{t.index.GitHub_Stars}</div>
        <div className="text-[44px] font-bold leading-none inline-flex items-center">
          <Ticker value={new Intl.NumberFormat().format(starCount)} />+
        </div>
      </div>
      <div className="flex-1 px-8 py-10 md:px-10 md:py-16 flex flex-col gap-1.5 border-wtf-border-divider mr-[-0.5px] border-[0.5px] border-solid">
        <div className="text-xl font-medium leading-none">
          {t.index.Contributor_Rewards}
        </div>
        <div className="text-[44px] font-bold leading-none inline-flex items-center">
          <Ticker
            value={new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(bonusAmount)}
          />+
        </div>
      </div>
    </section>
  );
};

const Skeleton = () => {
  return (
    <section className="container flex flex-col md:flex-row">
      <div className="flex-1 px-8 py-10 md:px-10 md:py-16 flex flex-col gap-1.5 border-wtf-border-divider mr-[-0.5px] border-[0.5px] border-solid">
        <div className="text-xl font-medium leading-none">Learners</div>
        <SkeletonUI className="w-1/2 h-[44px] rounded-md" />
      </div>
      <div className="flex-1 px-8 py-10 md:px-10 md:py-16 flex flex-col gap-1.5 border-wtf-border-divider mr-[-0.5px] border-[0.5px] border-solid">
        <div className="text-xl font-medium leading-none">Contributors</div>
        <SkeletonUI className="w-1/2 h-[44px] rounded-md" />
      </div>
      <div className="flex-1 px-8 py-10 md:px-10 md:py-16 flex flex-col gap-1.5 border-wtf-border-divider mr-[-0.5px] border-[0.5px] border-solid">
        <div className="text-xl font-medium leading-none">GitHub Stars</div>
        <SkeletonUI className="w-1/2 h-[44px] rounded-md" />
      </div>
      <div className="flex-1 px-8 py-10 md:px-10 md:py-16 flex flex-col gap-1.5 border-wtf-border-divider mr-[-0.5px] border-[0.5px] border-solid">
        <div className="text-xl font-medium leading-none">
          Contributor Rewards
        </div>
        <SkeletonUI className="w-1/2 h-[44px] rounded-md" />
      </div>
    </section>
  );
};

SectionStatistics.Skeleton = Skeleton;

export default SectionStatistics;
