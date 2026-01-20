import { useEffect, useRef } from "react";

interface SwipeHandlers {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
}

export function useSwipe({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown }: SwipeHandlers) {
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const touchEndRef = useRef<{ x: number; y: number } | null>(null);

    // Minimum distance to be considered a swipe
    const minSwipeDistance = 50;

    const onTouchStart = (e: TouchEvent) => {
        touchEndRef.current = null;
        touchStartRef.current = {
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY,
        };
    };

    const onTouchMove = (e: TouchEvent) => {
        touchEndRef.current = {
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY,
        };
    };

    const onTouchEnd = () => {
        if (!touchStartRef.current || !touchEndRef.current) return;

        const distanceX = touchStartRef.current.x - touchEndRef.current.x;
        const distanceY = touchStartRef.current.y - touchEndRef.current.y;
        const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);

        if (isHorizontal) {
            if (Math.abs(distanceX) < minSwipeDistance) return;
            if (distanceX > 0) {
                // Swiped Left (Finger moved Right to Left)
                if (onSwipeLeft) onSwipeLeft();
            } else {
                // Swiped Right (Finger moved Left to Right)
                if (onSwipeRight) onSwipeRight();
            }
        } else {
            if (Math.abs(distanceY) < minSwipeDistance) return;
            if (distanceY > 0) {
                // Swiped Up
                if (onSwipeUp) onSwipeUp();
            } else {
                // Swiped Down
                if (onSwipeDown) onSwipeDown();
            }
        }
    };

    useEffect(() => {
        const element = window;

        element.addEventListener("touchstart", onTouchStart);
        element.addEventListener("touchmove", onTouchMove);
        element.addEventListener("touchend", onTouchEnd);

        return () => {
            element.removeEventListener("touchstart", onTouchStart);
            element.removeEventListener("touchmove", onTouchMove);
            element.removeEventListener("touchend", onTouchEnd);
        };
    }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);
}
