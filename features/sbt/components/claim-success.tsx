"use client";

import { useAtomValue } from "jotai";
import { courseAtom, donationAmountAtom, donationOptInAtom } from "../atoms";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useMemo } from "react";
import Link from "next/link";
import {
  OS_LINK,
  SBT_CHAIN_SOCIAL_HANDLE,
  SBT_CURRENCY_SYMBOL,
} from "../constants/nft";
import { useDictionary } from "@/features/lang";

const ClaimSuccess = () => {
  const t = useDictionary();
  const donationAmount = useAtomValue(donationAmountAtom);
  const didDonate = useAtomValue(donationOptInAtom) && donationAmount > 0;
  const course = useAtomValue(courseAtom);

  const twLink = useMemo(() => {
    const text = `I completed the ${course?.title} course at WTF Academy and claimed a certificate on ${SBT_CHAIN_SOCIAL_HANDLE} ! @WTFAcademy_

Join us at ${window.location.origin}/course/${course?.path}`;

    return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
  }, [course]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      window.open(twLink, "_blank");
    }
  };

  return (
    <div className="flex flex-col justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">{t.sbt.congratulations}</h1>
      {didDonate && (
        <p className="text-lg font-medium">
          {t.sbt.donation_thanks
            .replace("{amount}", donationAmount.toString())
            .replace("{symbol}", SBT_CURRENCY_SYMBOL)}
        </p>
      )}

      <div className="flex flex-col w-full gap-3 mt-12">
        <Button size="xl" className="w-full rounded-full" onClick={handleShare}>
          <span className="text-base">{t.sbt.share_twitter}</span>
          <Icons.twitter className="w-5 h-5 ml-2" />
        </Button>
        <Link href={OS_LINK} target="_blank" className="w-full">
          <Button size="xl" variant="secondary" className="rounded-full w-full text-base">
            {t.sbt.view_nft}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ClaimSuccess;
