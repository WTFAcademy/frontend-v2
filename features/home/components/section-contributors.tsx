"use client";

import UserAvatar from "@/features/user/components/user-avatar";
import SectionHeader from "./section-header";
import { useGetContributors } from "../api/use-get-contributors";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import useBreakpoint from "@/hooks/use-breakpoint";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/features/lang";

const SectionContributors = () => {
  const t = useDictionary();
  const { data, isLoading } = useGetContributors();
  const {width} = useBreakpoint();
  const [isExpanded, setIsExpanded] = useState(false);

  const cutCount = width >= 2560 ? 12 : width >= 1440 ? 8 : width >= 768 ? 6 : 4;
  const cutData = (isExpanded ? data : data?.slice(0, cutCount * 2)) ?? [];

  if (isLoading || !data) {
    return (
      <section className="w-full">
        <SectionHeader
          title={t.index.Contributors}
          description={t.index.The_best_way_to_learn_is_to_share}
        />

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-1.5 h-[180px] border-wtf-border-divider border-[0.5px] border-solid"
            >
              <Skeleton className="w-16 h-16" />
              <Skeleton className="w-16 h-4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container w-full">
      <SectionHeader
        title={t.index.Contributors}
        description={t.index.The_best_way_to_learn_is_to_share}
      />

      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 4xl:grid-cols-12">
        {cutData.map((contributor) => (
          <div
            key={contributor.id}
            className="flex flex-col mr-[-0.5px] mb-[-0.5px] items-center justify-center gap-1.5 h-[180px] border-wtf-border-divider border-[0.5px] border-solid"
          >
            <UserAvatar
              className="w-16 h-16"
              src={contributor.avatar_url}
              fallback={`${contributor.login} (${contributor.contributions})`}
            />
            <div className="w-full text-center text-wtf-content-1 text-ellipsis whitespace-nowrap text-sm font-normal truncate">
              {contributor.login}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col justify-center items-center gap-2.5 pt-6 pb-16 border-wtf-border-divider border-[0.5px]">
        <Button
          variant="outline"
          size="xl"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? t.index.Collapse : t.index.Expand} {t.index.All_Contributors}
        </Button>
      </div>
    </section>
  );
};

export default SectionContributors;
