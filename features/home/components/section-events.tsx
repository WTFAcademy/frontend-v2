import SectionHeader from "./section-header";
import Image from "next/image";
import eventsData from "@/public/constants/events/events.json";
import { headers } from "next/headers";
import { getDictionary } from "@/app/[lang]/dictionaries";

type TEvent = {
  name: string;
  start_date: string;
  end_date: string;
  location: string;
  description: string;
  banner_image: string;
};

const events: TEvent[] = eventsData;

const SectionEvents = async () => {
  const heads = headers()
  const lang = heads.get('x-current-lang')
  const t = await getDictionary(lang)
  return (
    <section className="container flex flex-col">
      <SectionHeader
        title={t.index.Events}
        description={t.index.The_purpose_of_learning_is_to_create_together}
        moreUrl="/events"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 4xl:grid-cols-4 border-wtf-border-divider border-x-[0.5px]">
        {events.map((event) => (
          <div
            key={event.name}
            className="flex flex-col gap-6 p-8 mr-[-0.5px] md:p-10 border-wtf-border-divider border-[0.5px] border-solid"
          >
            <div className="relative w-full h-[180px] md:h-[220px]">
              <Image
                src={event.banner_image}
                alt={event.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="text-wtf-content-1 text-[22px] font-bold leading-none">
                {event.name}
              </div>
              <div className="text-wtf-content-3 text-sm font-normal leading-6">
                {event.start_date} ~ {event.end_date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionEvents;
