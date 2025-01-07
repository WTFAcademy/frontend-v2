"use client";

import { ArrowRightIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { useDictionary } from "@/features/lang";

type TSectionHeader = {
  title: string;
  description: string;
  moreUrl?: string;
  className?: string;
};

const SectionHeader = ({ title, description, moreUrl, className }: TSectionHeader) => {
  const t = useDictionary();
  return (
    <div className={`w-full pt-[72px] pb-9 px-8 md:px-10 border-wtf-border-divider my-[-0.5px] border-[0.5px] border-solid ${className}`}>
      <div className="flex flex-col gap-y-2 md:flex-row md:justify-between">
        <div className="flex flex-col gap-y-2">
          <div className="text-4xl font-bold">{title}</div>
          <div className="text-base font-normal">{description}</div>
        </div>
        <div className="flex items-end">
          {moreUrl && (
            <Link
              href={moreUrl}
              className="group flex items-center text-wtf-function-link text-base"
            >
              <span className="text-base leading-none mr-1">{t.index.View_All}</span>
              <motion.div
                className="inline-flex items-center"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
