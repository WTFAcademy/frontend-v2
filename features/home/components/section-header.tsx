import {
  ArrowRightIcon
} from "@radix-ui/react-icons";
import Link from "next/link";

type TSectionHeader = {
  title: string;
  description: string;
  moreUrl?: string;
};

const SectionHeader = ({ title, description, moreUrl }: TSectionHeader) => {
  return (
    <div className="w-full pt-[72px] pb-9 px-10 border-wtf-border-divider border-[0.5px] border-solid">
      <div className="flex flex-col gap-y-2 md:flex-row md:justify-between">
        <div className="flex flex-col gap-y-2">
          <div className="text-4xl font-bold">{title}</div>
          <div className="text-base font-normal">
            {description}
          </div>
        </div>
        <div className="flex items-end">
          {moreUrl && (
            <Link href={moreUrl} className="flex items-center text-wtf-text-link text-base gap-x-2">
              <span className="text-base leading-none">View All</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
