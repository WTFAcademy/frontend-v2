import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAtom } from 'jotai';
import { useMediaQuery } from '@/hooks/use-media-query';
import { controlVisibleAtom } from '../atoms/mobile-reader';

interface MobileReaderInteraction {
  isControlVisible: boolean;
  showControl: () => void;
  hideControl: () => void;
  toggleControl: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  scrollRef: React.RefObject<HTMLDivElement>;
}

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
}

export function useMobileReaderInteraction(): MobileReaderInteraction {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isControlVisible, setIsControlVisible] = useAtom(controlVisibleAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchState = useRef<TouchState | null>(null);
  const [isAtEdge, setIsAtEdge] = useState(true);
  
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isChapterDetailPath = /^\/course\/[^/]+\/[^/]+$/.test(pathname);

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

  // 处理滚动事件
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const controlNavbar = () => {
      const currentScrollY = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;
      const isAtBottom = clientHeight + currentScrollY >= scrollHeight - 50;
      const isAtTop = currentScrollY <= 50;
      
      setIsAtEdge(isAtBottom || isAtTop);
      
      if (Math.abs(currentScrollY - lastScrollY) < 10) return;
      
      if (isChapterDetailPath && !isDesktop) {
        if (isAtTop || isAtBottom) {
          showControl();
        } else {
          hideControl();
        }
      } else {
        showControl();
      }
      
      setLastScrollY(currentScrollY);
    };
    
    scrollContainer.addEventListener('scroll', controlNavbar, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY, isChapterDetailPath, isDesktop, hideControl, showControl]);

  // 当不在章节详情页或在桌面端时，强制显示control
  useEffect(() => {
    if (!isChapterDetailPath || isDesktop) {
      showControl();
    }
  }, [isChapterDetailPath, isDesktop, showControl]);

  // 处理容器内的触摸事件
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (isAtEdge) return;

      const containerHeight = container.clientHeight;
      const touchY = e.touches[0].clientY;
      const rect = container.getBoundingClientRect();
      const relativeY = touchY - rect.top;
      
      if (relativeY > containerHeight * 0.25 && relativeY < containerHeight * 0.75) {
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

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [showControl, isChapterDetailPath, isDesktop, isAtEdge]);

  return {
    isControlVisible,
    showControl,
    hideControl,
    toggleControl,
    containerRef,
    scrollRef,
  };
}