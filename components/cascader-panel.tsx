"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton as SkeletonUI } from "./ui/skeleton";

interface CascaderOption {
  label: string;
  value: string;
  children?: CascaderOption[];
}

interface CascaderContextValue {
  activeKeys: string[];
  onHover: (value: string, level: number) => void;
  onSelect: (value: string, level: number) => void;
}

const CascaderContext = React.createContext<CascaderContextValue | undefined>(undefined);

interface CascaderProps {
  options: CascaderOption[];
  onSelect?: (values: string[]) => void;
  defaultValue?: string[];
  className?: string;
}

export function CascaderPanel({ 
  options,
  onSelect, 
  defaultValue = [],
  className 
}: CascaderProps) {
  const [activeKeys, setActiveKeys] = React.useState<string[]>(defaultValue);

  const findOptions = React.useCallback((level: number): CascaderOption[] => {
    if (level === 0) return options;
    
    let currentOptions = options;
    for (let i = 0; i < level; i++) {
      const option = currentOptions.find(opt => opt.value === activeKeys[i]);
      if (!option?.children) return [];
      currentOptions = option.children;
    }
    console.log("currentOptions: ", currentOptions);
    
    return currentOptions;
  }, [options, activeKeys]);

  const handleHover = React.useCallback((value: string, level: number) => {
    const newKeys = [...activeKeys.slice(0, level), value];
    setActiveKeys(newKeys);
  }, [activeKeys]);

  const handleSelect = React.useCallback((value: string, level: number) => {
    const newKeys = [...activeKeys.slice(0, level), value];
    const currentOption = findOptions(level).find(opt => opt.value === value);
    
    if (!currentOption?.children) {
      setActiveKeys(newKeys);
      onSelect?.(newKeys);
    }
  }, [activeKeys, onSelect, findOptions]);

  const levels = React.useMemo(() => {
    let count = 1;
    let currentOptions = options;
    
    for (const key of activeKeys) {
      const option = currentOptions.find(opt => opt.value === key);
      if (!option?.children) break;
      currentOptions = option.children;
      count++;
    }
    
    return Array.from({ length: count }, (_, i) => i);
  }, [options, activeKeys]);

  return (
    <CascaderContext.Provider value={{ 
      activeKeys, 
      onHover: handleHover,
      onSelect: handleSelect 
    }}>
      <motion.div 
        className={cn(
          "flex overflow-hidden",
          className
        )}
        initial={false}
      >
        <AnimatePresence initial={false}>
          {levels.map(level => (
            <CascaderLevel 
              key={level}
              level={level} 
              options={findOptions(level)} 
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </CascaderContext.Provider>
  );
}

interface CascaderLevelProps {
  level: number;
  options: CascaderOption[];
}

export function CascaderLevel({ level, options }: CascaderLevelProps) {
  const context = React.useContext(CascaderContext);
  if (!context) throw new Error("CascaderLevel must be used within CascaderPanel");

  const { activeKeys, onHover, onSelect } = context;
  const activeKey = activeKeys[level];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.15 }}
      className={cn("min-w-[200px] border-r-[0.5px] p-2 border-wtf-border-line last:border-r-0")}
    >
      {options.map((option) => (
        <motion.div
          key={option.value}
          onMouseEnter={() => onHover(option.value, level)}
          onClick={() => onSelect(option.value, level)}
          className={cn(
            "flex items-center justify-between p-3 cursor-pointer",
            "relative"
          )}
        >
          <span className="relative z-10">{option.label}</span>
          {option.children && (
            <ChevronRight className="h-4 w-4 relative z-10" />
          )}
          {activeKey === option.value && (
            <motion.div
              layoutId={`highlight-${level}`}
              className="absolute inset-0 rounded-lg bg-wtf-background-hover"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

const Skeleton = () => {
  return (
    <div className="min-w-[200px] border-r-[0.5px] p-2 border-wtf-border-line last:border-r-0">
      <SkeletonUI className="w-full h-[40px] mb-2" />
      <SkeletonUI className="w-full h-[40px]" />
    </div>
  );
};

CascaderPanel.Skeleton = Skeleton;