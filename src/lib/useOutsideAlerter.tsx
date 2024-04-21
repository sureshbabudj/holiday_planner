import React, { MutableRefObject, useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export default function useOutsideAlerter(
  ref: MutableRefObject<any>,
  cb: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (event.target && ref.current && !ref.current.contains(event.target)) {
        cb();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, cb]);
}
