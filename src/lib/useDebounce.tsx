import { useRef, useMemo, useEffect } from "react";

const debounce = <T extends (...args: any[]) => any>(
  callback: T,
  waitFor: number
) => {
  let timeout: any = 0;
  return (...args: Parameters<T>): ReturnType<T> => {
    let result: any;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      result = callback(...args);
    }, waitFor);
    return result;
  };
};

const useDebounce = <T extends unknown[], S>(
  callback: (...args: T) => S,
  delay: number = 1000
) => {
  const ref = useRef(callback);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = (...arg: T) => {
      return ref.current(...arg);
    };

    return debounce(func, delay);
  }, [delay]);

  return debouncedCallback;
};

export default useDebounce;
