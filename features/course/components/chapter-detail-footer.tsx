"use client";

import { Button } from "@/components/ui/button";
import { useMobileReaderInteraction } from "@/features/course/hooks/use-mobile-reader-interaction";
import { AnimatePresence, motion } from "framer-motion";

const ChapterDetailFooter = () => {
  const { isControlVisible } = useMobileReaderInteraction();

  return (
    <AnimatePresence>
      <motion.div 
        className="sticky bottom-0 left-0 right-0 bg-wtf-background-block border-t border-wtf-border-divider px-6 py-4 flex justify-between items-center"
        initial={{ y: 0 }}
        animate={{ y: isControlVisible ? 0 : 100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4">
          <Button>Quiz</Button>
          <Button>Code</Button>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="secondary">Previous</Button>
          <Button variant="secondary">Next</Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChapterDetailFooter;
