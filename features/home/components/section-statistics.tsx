import Ticker from "@/components/animata/text/ticker";

const SectionStatistics = () => {
  return (
    <section className="flex flex-col md:flex-row">
      <div className="flex-1 px-8 py-10 md:px-10 md:py-16 flex flex-col gap-1.5 border-wtf-border-divider border-[0.5px] border-solid">
        <div className="text-xl font-medium leading-none">Learners</div>
        <div className="text-[44px] font-bold leading-none inline-flex items-center">
          <Ticker value={new Intl.NumberFormat().format(10000)} />+
        </div>
      </div>
      <div className="flex-1 px-8 py-10 md:px-10 md:py-16 flex flex-col gap-1.5 border-wtf-border-divider border-[0.5px] border-solid">
        <div className="text-xl font-medium leading-none">Contributors</div>
        <div className="text-[44px] font-bold leading-none inline-flex items-center">
          <Ticker value={new Intl.NumberFormat().format(200)} />+
        </div>
      </div>
      <div className="flex-1 px-8 py-10 md:px-10 md:py-16 flex flex-col gap-1.5 border-wtf-border-divider border-[0.5px] border-solid">
        <div className="text-xl font-medium leading-none">GitHub Stars ⭐️</div>
        <div className="text-[44px] font-bold leading-none inline-flex items-center">
          <Ticker value={new Intl.NumberFormat().format(15000)} />+
        </div>
      </div>
      <div className="flex-1 px-8 py-10 md:px-10 md:py-16 flex flex-col gap-1.5 border-wtf-border-divider border-[0.5px] border-solid">
        <div className="text-xl font-medium leading-none">
          Contributor Rewards
        </div>
        <div className="text-[44px] font-bold leading-none inline-flex items-center">
          <Ticker
            value={new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(1000000)}
          />+
        </div>
      </div>
    </section>
  );
};

export default SectionStatistics;
