"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

function Number({
  value,
  index,
  total,
  delay,
  className,
  getHeight,
  isVisible,
}: {
  value: string;
  index: number;
  getHeight: () => number;
  className?: string;
  total: number;
  delay?: number;
  isVisible: boolean;
}) {
  const numberRef = useRef<HTMLDivElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 150 - index * 2,
    damping: 15,
  });

  const isRaw = String(+value) !== value;

  useEffect(() => {
    if (isRaw || !numberRef.current || !isVisible) {
      return;
    }

    const update = () => {
      const height = getHeight();
      springValue.set(-height * +value);
    };

    if (!delay) {
      update();
      return;
    }

    const timer = setTimeout(update, (total - index) * Math.floor(Math.random() * delay));

    return () => clearTimeout(timer);
  }, [value, isRaw, springValue, getHeight, index, total, delay, isVisible]);

  if (isRaw) {
    return <span>{value}</span>;
  }

  return (
    <motion.div
      ref={numberRef}
      style={{
        translateY: springValue,
      }}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div className={className} key={i}>
          {i}
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function Ticker({
  value,
  delay,
  className,
  numberClassName,
}: {
  value: string;
  className?: string;
  numberClassName?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const parts = String(value).trim().split("");
  const divRef = useRef<HTMLDivElement>(null);
  const getHeight = useCallback(() => divRef.current?.getBoundingClientRect().height ?? 0, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden whitespace-pre tabular-nums text-foreground",
        className,
      )}
    >
      <div className="absolute inset-0 flex min-w-fit">
        {parts.map((part, index) => (
          <Number
            getHeight={getHeight}
            index={index}
            key={index}
            value={part}
            total={parts.length}
            className={numberClassName}
            delay={delay}
            isVisible={isVisible}
          />
        ))}
      </div>
      <div ref={divRef} className="invisible min-w-fit">
        {value}
      </div>
    </div>
  );
}
