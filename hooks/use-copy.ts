import { useState, useCallback } from 'react';

const useCopy = () => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback((value: string) => {
    navigator.clipboard.writeText(value)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      })
      .catch((error) => {
        console.error('复制失败:', error);
      });
  }, []);

  return {
    copied,
    copy
  };
}

export default useCopy;