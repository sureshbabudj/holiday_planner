import { debounce } from "@/lib/utils";
import { useRef, useState } from "react";
import { Search } from "lucide-react";
import { Skeleton } from "./skeleton";
import useOutsideAlerter from "@/lib/useOutsideAlerter";
import { Option } from "@/types";

export interface AutoCompleteProps<T extends Option> {
  value?: T;
  options?: T[];
  placeholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  onValueChange?: (value: T) => void;
  onInputChange?: (value: string) => void;
}

export function AutoComplete({
  value,
  options = [],
  placeholder = "Search...",
  emptyMessage = "No results found",
  isLoading = false,
  onValueChange,
  onInputChange,
}: AutoCompleteProps<Option>) {
  const inputRef = useRef(null);
  const ref = useRef(null);

  useOutsideAlerter(ref, () => {
    setOpen(false);
  });

  const [open, setOpen] = useState(false);
  const handleKeyDown = debounce((e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if (value === "") {
      setOpen(false);
      return;
    }

    onInputChange?.(value);
    setOpen(true);

    if (e.key === "Enter" && options.length && value !== "") {
      const option = options.find((option) => option.value === value);
      if (option) {
        onValueChange?.(option);
      }
    }
  }, 300);

  const handleSelect = (option: Option) => {
    (inputRef.current! as HTMLInputElement).value = option.value;

    onValueChange?.(option);
    setOpen(false);
  };

  return (
    <div className="autocomplete" ref={ref}>
      <div className="relative">
        <Search className="absolute left-2 top-2 w-5 text-slate-500"></Search>
        <input
          className="border border-gray-300 rounded-md pr-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          type="text"
          onKeyDown={handleKeyDown}
          ref={inputRef}
          defaultValue={value?.label ?? ""}
          placeholder={placeholder}
        />
      </div>
      <div className="relative">
        {open && (
          <div className="absolute w-full border p-2 bg-white z-10 top-0 left-0 rounded mt-[4px]">
            {isLoading ? (
              <>
                {Array.from(Array(5).keys()).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-8 mb-2 last:mb-0"
                  ></Skeleton>
                ))}
              </>
            ) : (
              <>
                {options.length > 0 ? (
                  <ul className="">
                    {options.map((option, index) => (
                      <li
                        className="py-1 px-2 text-base focus:bg-slate-400 hover:bg-slate-200 rounded cursor-pointer"
                        onClick={() => handleSelect(option)}
                        key={`${option.value}-${index}`}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>{emptyMessage}</div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
