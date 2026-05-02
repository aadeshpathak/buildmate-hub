import { useState, useRef, useEffect, useCallback } from 'react';

export const useMobileCarousel = (totalItems: number) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemWidth = useRef(0);
  const gap = useRef(16); // 16px gap between items

  // Touch handling
  const startX = useRef(0);
  const currentX = useRef(0);
  const startTime = useRef(0);
  const isDraggingRef = useRef(false);
  const animationRef = useRef<number>();

  const itemWithGap = itemWidth.current + gap.current;

  const updateItemWidth = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      // Account for padding and ensure cards fit properly
      itemWidth.current = Math.min(280, containerWidth - 32); // Max 280px, min container width
      gap.current = 16;
    }
  }, []);

  const animateToIndex = useCallback((targetIndex: number) => {
    if (!containerRef.current) return;

    const targetTranslateX = -targetIndex * itemWithGap;
    const startTranslateX = translateX;
    const distance = targetTranslateX - startTranslateX;
    const duration = 300; // 300ms animation
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentTranslateX = startTranslateX + distance * easeOut;

      setTranslateX(currentTranslateX);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setActiveIndex(targetIndex);
        setTranslateX(targetTranslateX);
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animate();
  }, [translateX, itemWithGap]);

  const scrollToIndex = useCallback((index: number) => {
    if (index >= 0 && index < totalItems) {
      animateToIndex(index);
    }
  }, [totalItems, animateToIndex]);

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
    updateItemWidth();
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
    startTime.current = Date.now();
    isDraggingRef.current = false;

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [updateItemWidth]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDraggingRef.current) {
      currentX.current = e.touches[0].clientX;
      const deltaX = currentX.current - startX.current;

      // Apply resistance at boundaries
      let newTranslateX = translateX + deltaX * 0.5; // Dampen the movement

      // Boundary constraints with resistance
      const minTranslateX = -(totalItems - 1) * itemWithGap;
      const maxTranslateX = 0;

      if (newTranslateX > maxTranslateX) {
        newTranslateX = maxTranslateX + (newTranslateX - maxTranslateX) * 0.3; // Resistance
      } else if (newTranslateX < minTranslateX) {
        newTranslateX = minTranslateX + (newTranslateX - minTranslateX) * 0.3; // Resistance
      }

      setTranslateX(newTranslateX);
      e.preventDefault();
    } else {
      // Determine if this is a horizontal swipe
      const deltaX = Math.abs(e.touches[0].clientX - startX.current);
      const deltaY = Math.abs(e.touches[0].clientY - (startX.current + (translateX / itemWithGap) * gap.current)); // Approximate Y tracking

      if (deltaX > deltaY && deltaX > 10) {
        isDraggingRef.current = true;
        setIsDragging(true);
        e.preventDefault();
      }
    }
  }, [translateX, totalItems, itemWithGap]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = currentX.current - startX.current;
    const deltaTime = Date.now() - startTime.current;
    const velocity = Math.abs(deltaX) / deltaTime; // pixels per ms

    setIsDragging(false);
    isDraggingRef.current = false;

    // Determine target index based on position and velocity
    const currentPosition = -translateX / itemWithGap;
    let targetIndex = Math.round(currentPosition);

    // Apply velocity threshold for additional slide
    const velocityThreshold = 0.5; // pixels/ms threshold
    if (velocity > velocityThreshold) {
      if (deltaX > 0 && targetIndex > 0) {
        targetIndex = Math.max(0, targetIndex - 1);
      } else if (deltaX < 0 && targetIndex < totalItems - 1) {
        targetIndex = Math.min(totalItems - 1, targetIndex + 1);
      }
    }

    // Ensure target index is within bounds
    targetIndex = Math.max(0, Math.min(totalItems - 1, targetIndex));

    animateToIndex(targetIndex);
  }, [translateX, itemWithGap, totalItems, animateToIndex]);

  // Initialize on mount and resize
  useEffect(() => {
    updateItemWidth();

    const handleResize = () => {
      updateItemWidth();
      // Reset position on resize
      setTranslateX(-activeIndex * itemWithGap);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex, itemWithGap, updateItemWidth]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd, { passive: false });

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    activeIndex,
    isDragging,
    containerRef,
    scrollToIndex,
    goToNext,
    goToPrev,
    canGoNext: activeIndex < totalItems - 1,
    canGoPrev: activeIndex > 0,
    transform: `translateX(${translateX}px)`,
    itemWithGap,
    totalWidth: totalItems * itemWithGap
  };
};