import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export interface YearPickerProps {
  placeholder?: string;
  className?: string;
  selectedYear?: string;
  onYearSelect?: (year: string) => void;
  value?: string;
}

export function YearPicker({
  placeholder = "Select year",
  className,
  selectedYear,
  onYearSelect,
  value,
}: YearPickerProps) {
  const current = new Date().getFullYear();
  const years = Array.from(Array(5).keys()).map((i) => current + i);

  return (
    <Select
      onValueChange={onYearSelect}
      defaultValue={value ?? String(current)}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} defaultValue={selectedYear} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {years.map((year) => (
            <SelectItem value={String(year)} key={year}>
              {year}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
