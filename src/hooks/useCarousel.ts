import { useState, useRef, useEffect, useCallback } from 'react';

export const useMobileCarousel = (totalItems: number) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isScrolling = useRef(false);

  const scrollToIndex = useCallback((index: number) => {
    if (containerRef.current && index >= 0 && index < totalItems) {
      setActiveIndex(index);
      const container = containerRef.current;
      const itemWidth = container.clientWidth;
      container.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
    }
  }, [totalItems]);

  const goToNext = useCallback(() => {
    if (activeIndex < totalItems - 1) {
      scrollToIndex(activeIndex + 1);
    }
  }, [activeIndex, totalItems, scrollToIndex]);

  const goToPrev = useCallback(() => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    }
  }, [activeIndex, scrollToIndex]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
    setIsDragging(true);
    isScrolling.current = false;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;

    currentX.current = e.touches[0].clientX;
    const deltaX = Math.abs(currentX.current - startX.current);
    const deltaY = Math.abs(e.touches[0].clientY - startX.current); // Note: This should track Y from start

    // Determine if scrolling horizontally
    if (!isScrolling.current && deltaX > deltaY && deltaX > 10) {
      isScrolling.current = true;
      e.preventDefault(); // Prevent vertical scroll when swiping horizontally
    }

    if (isScrolling.current) {
      e.preventDefault();
    }
  }, [isDragging]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isDragging) return;

    const deltaX = currentX.current - startX.current;
    const velocity = Math.abs(deltaX);

    setIsDragging(false);

    // Swipe detection with velocity threshold
    if (velocity > 50) {
      if (deltaX > 0 && activeIndex > 0) {
        goToPrev();
      } else if (deltaX < 0 && activeIndex < totalItems - 1) {
        goToNext();
      }
    }
  }, [isDragging, activeIndex, totalItems, goToNext, goToPrev]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const itemWidth = container.clientWidth;
      const scrollLeft = container.scrollLeft;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd, { passive: false });
      container.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleScroll]);

  return {
    activeIndex,
    isDragging,
    containerRef,
    scrollToIndex,
    goToNext,
    goToPrev,
    canGoNext: activeIndex < totalItems - 1,
    canGoPrev: activeIndex > 0,
    transform: 'translateX(0px)',
    itemWithGap: 0,
    totalWidth: 0
  };
};