import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export interface MonthPickerProps {
  placeholder?: string;
  className?: string;
  selectedMonth?: string;
  onMonthSelect?: (month: string) => void;
}

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function MonthPicker({
  placeholder = "Select Month",
  className,
  selectedMonth,
  onMonthSelect,
}: MonthPickerProps) {
  return (
    <Select onValueChange={onMonthSelect}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} defaultValue={selectedMonth} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {months.map((month) => (
            <SelectItem value={month} key={month}>
              {month}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
