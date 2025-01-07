"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Icons } from "./icons";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "./ui/switch";

type NavItem = {
  url?: string;
  name: string;
  children?: NavItem[];
};

type TNavItemProps = {
  items: NavItem[];
  groupName: string;
  groupIcon?: React.ReactNode;
};

const NavItem = ({
  items,
  groupName,
  groupIcon,
  url,
}: TNavItemProps & { url?: string }) => {
  const pathname = usePathname();

  const [isExpanded, setIsExpanded] = useState(
    items.some((item) => item.url === pathname)
  );
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});

  if (!items?.length) {
    return (
      <Link href={url || ""} className="relative z-20 flex flex-col">
        <div className="flex items-center h-[56px] px-5">
          <div className="flex items-center gap-2 text-base font-medium">
            {groupIcon && groupIcon}
            <span>{groupName}</span>
          </div>
        </div>
      </Link>
    );
  }

  const isActive = (path: string) => {
    return pathname === path ? "bg-white rounded-md text-black" : "";
  };

  const renderNavItems = (items: NavItem[], level = 0) => {
    return items.map((item, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, delay: level * 0.1 + index * 0.05 }}
      >
        {!item.children ? (
          <Link
            href={item.url!}
            className={cn(
              "py-4 px-7 transition-all duration-200 block",
              isActive(item.url!)
            )}
          >
            {item.name}
          </Link>
        ) : (
          <>
            <div
              className="py-4 px-5 flex items-center justify-between cursor-pointer"
              onClick={() => {
                const newExpanded = { ...expandedItems };
                newExpanded[item.name] = !newExpanded[item.name];
                setExpandedItems(newExpanded);
              }}
            >
              {item.name}
              <motion.div
                animate={{ rotate: expandedItems[item.name] ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Icons.arrowRight className="w-4 h-4" />
              </motion.div>
            </div>
            <AnimatePresence>
              {expandedItems[item.name] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderNavItems(item.children, level + 1)}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    ));
  };

  return (
    <div className="relative z-20 flex flex-col">
      <div
        className="flex items-center justify-between h-[56px] px-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 text-base font-medium">
          {groupIcon && groupIcon}
          <span>{groupName}</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icons.arrowRight className="w-4 h-4" />
        </motion.div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-wtf-background-block"
          >
            {renderNavItems(items)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const NavSelectionItem = ({
  options,
  groupName,
  groupIcon,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  groupName: string;
  groupIcon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = (currentValue: string) => {
    return currentValue === value ? "bg-white rounded-md text-black" : "";
  };

  const renderNavItems = () => {
    return options.map((item, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
      >
        <div
          onClick={() => onChange(item.value)}
          className="py-4 px-7 transition-all duration-200 block flex items-center justify-between"
        >
          {item.label}
          {isActive(item.value) && <Icons.check className="w-4 h-4" />}
        </div>
      </motion.div>
    ));
  };

  return (
    <div className="relative z-20 flex flex-col mt-2">
      <div
        className="flex items-center justify-between h-[56px] px-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 text-base font-medium">
          {groupIcon && groupIcon}
          <span>{groupName}</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icons.arrowRight className="w-4 h-4" />
        </motion.div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-wtf-background-block"
          >
            {renderNavItems()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const NavSwitchItem = ({
  groupName,
  groupIcon,
  value,
  onChange,
}: {
  groupName: string;
  groupIcon?: React.ReactNode;
  value: boolean;
  onChange: (value: boolean) => void;
}) => {
  return (
    <div className="flex items-center justify-between h-[56px] px-5 cursor-pointer">
      <div className="flex items-center gap-2 text-base font-medium">
        {groupIcon && groupIcon}
        <span>{groupName}</span>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
};

export default NavItem;
