import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useAtom } from 'jotai';
import { useMediaQuery } from '@/hooks/use-media-query';
import { controlVisibleAtom } from '../atoms/mobile-reader';
import { throttle } from 'lodash-es';

interface MobileReaderInteraction {
  isControlVisible: boolean;
  showControl: () => void;
  hideControl: () => void;
  toggleControl: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
}

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
}

export function useMobileReaderInteraction(): MobileReaderInteraction {
  const lastScrollYRef = useRef(0);
  const [isControlVisible, setIsControlVisible] = useAtom(controlVisibleAtom);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchState = useRef<TouchState | null>(null);
  const [isAtEdge, setIsAtEdge] = useState(true);
  
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isChapterDetailPath = /\/course\/[^/]+\/[^/]+$/.test(pathname);

  const showControl = useCallback(() => {
    setIsControlVisible(true);
  }, [setIsControlVisible]);

  const hideControl = useCallback(() => {
    if (isChapterDetailPath && !isDesktop) {
      setIsControlVisible(false);
    }
  }, [isChapterDetailPath, isDesktop, setIsControlVisible]);

  const toggleControl = useCallback(() => {
    setIsControlVisible(prev => !prev);
  }, [setIsControlVisible]);

  // 处理滚动事件控制显隐
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isDesktop || !isChapterDetailPath) return;

    const controlNavbar = throttle(() => {
      const currentScrollY = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;
      const isAtBottom = clientHeight + currentScrollY >= scrollHeight - 50;
      const isAtTop = currentScrollY <= 50;
      
      setIsAtEdge(isAtBottom || isAtTop);
      
      if (Math.abs(currentScrollY - lastScrollYRef.current) < 10) return;
      
      if (isChapterDetailPath && !isDesktop) {
        if (isAtTop || isAtBottom) {
          showControl();
        } else {
          hideControl();
        }
      } else {
        showControl();
      }
      
      lastScrollYRef.current = currentScrollY;
    }, 100, {
      leading: true,
      trailing: true,
    });
    
    scrollContainer.addEventListener('scroll', controlNavbar, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', controlNavbar);
  }, [isChapterDetailPath, isDesktop, hideControl, showControl]);

  useEffect(() => {
    if (!isChapterDetailPath || isDesktop) {
      showControl();
    }
  }, [isChapterDetailPath, isDesktop, showControl]);

  // 处理点击中间区域控制显隐
  useEffect(() => {
    if (typeof window === 'undefined' || isDesktop) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (isAtEdge) return;

      const viewportHeight = window.innerHeight;
      const touchY = e.touches[0].clientY;
      
      if (touchY > viewportHeight * 0.25 && touchY < viewportHeight * 0.75) {
        touchState.current = {
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          startTime: Date.now()
        };
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAtEdge || !touchState.current) return;
      
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
        time: Date.now()
      };

      const deltaX = touchEnd.x - touchState.current.startX;
      const deltaY = touchEnd.y - touchState.current.startY;
      const deltaTime = touchEnd.time - touchState.current.startTime;

      const velocityY = Math.abs(deltaY / deltaTime);
      
      const isValidTap = 
        deltaTime < 300 &&
        Math.abs(deltaX) < 10 &&
        Math.abs(deltaY) < 10 &&
        velocityY < 0.2;

      if (isValidTap && isChapterDetailPath && !isDesktop) {
        toggleControl();
      }
      
      touchState.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchState.current) return;

      const deltaY = e.touches[0].clientY - touchState.current.startY;
      const deltaTime = Date.now() - touchState.current.startTime;
      
      if (Math.abs(deltaY) > 10 && deltaTime < 100) {
        touchState.current = null;
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isAtEdge, isChapterDetailPath, isDesktop, toggleControl]);

  const controls = useMemo(
    () => ({
      isControlVisible,
      showControl,
      hideControl,
      toggleControl,
    }),
    [isControlVisible, showControl, hideControl, toggleControl]
  );

  return {
    ...controls,
    scrollRef,
  };
}