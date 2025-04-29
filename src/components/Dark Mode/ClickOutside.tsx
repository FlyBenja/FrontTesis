import React, { useRef, useEffect } from 'react';

/**
 * Props interface for the ClickOutside component.
 * 
 */
interface Props {
  children: React.ReactNode;
  exceptionRef?: React.RefObject<HTMLElement>;
  onClick: () => void;
  className?: string;
}

/**
 * ClickOutside Component
 * 
 * This component detects clicks outside of its wrapped content and executes a given callback (`onClick`).
 * It can also accept an `exceptionRef`, allowing specific elements to be ignored when clicking.
 * 
 * Useful for closing dropdowns, modals, or popups when clicking outside their boundaries.
 * 
 */
const ClickOutside: React.FC<Props> = ({
  children,
  exceptionRef,
  onClick,
  className,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /**
     * Handles mouse click events on the document.
     * If the click occurred outside the wrapper and the exception (if any), it triggers the `onClick` callback.
     * 
     * @param {MouseEvent} event - The mouse event triggered by clicking.
     */
    const handleClickListener = (event: MouseEvent) => {
      let clickedInside: boolean | null = false;

      if (exceptionRef) {
        clickedInside =
          (wrapperRef.current &&
            wrapperRef.current.contains(event.target as Node)) ||
          (exceptionRef.current && exceptionRef.current === event.target) ||
          (exceptionRef.current &&
            exceptionRef.current.contains(event.target as Node));
      } else {
        clickedInside =
          wrapperRef.current &&
          wrapperRef.current.contains(event.target as Node);
      }

      if (!clickedInside) {
        onClick();
      }
    };

    document.addEventListener('mousedown', handleClickListener);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickListener);
    };
  }, [exceptionRef, onClick]);

  return (
    <div ref={wrapperRef} className={`${className || ''}`}>
      {children}
    </div>
  );
};

export default ClickOutside;
