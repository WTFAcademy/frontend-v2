import Image from "next/image";
import SectionHeader from "./section-header";

const OpenSourceIconPath = "/svgs/open-source.svg";
const OnChainCertificationIconPath = "/svgs/on-chain-certificates.svg";
const PrToEarnIconPath = "/svgs/pr-to-earn.svg";
const CommunityDrivenIconPath = "/svgs/community-driven.svg";

const INFOS = {
  openSource: {
    title: "Open Source",
    icon: (
      <Image
        src={OpenSourceIconPath}
        width={100}
        height={100}
        alt="Open Source"
      />
    ),
  },
  onChainCertification: {
    title: "On Chain Certification",
    icon: (
      <Image
        src={OnChainCertificationIconPath}
        width={100}
        height={100}
        alt="On Chain Certification"
      />
    ),
  },
  prToEarn: {
    title: "PR to Earn",
    icon: (
      <Image src={PrToEarnIconPath} width={100} height={100} alt="PR to Earn" />
    ),
  },
  communityDriven: {
    title: "Community Driven",
    icon: (
      <Image
        src={CommunityDrivenIconPath}
        width={100}
        height={100}
        alt="Community Driven"
      />
    ),
  },
};

const SectionCommunity = () => {
  return (
    <section className="w-full flex flex-col">
      <div className="container">
        <SectionHeader
          title="Blockchain-Powered Community"
          description="Blockchain Technology and Community-Driven Open Source Incentive Mechanism"
        />
        <div className="grid grid-cols-2 md:flex md:flex-row">
          {Object.values(INFOS).map((info, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center mr-[-0.5px] gap-6 md:gap-8 p-8 md:px-10 md:py-14 border-wtf-border-divider border-[0.5px] border-solid"
            >
              {info.icon}
              <div className="text-wtf-content-1 text-lg font-bold leading-none text-center">
                {info.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionCommunity;
