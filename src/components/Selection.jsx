import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Selection ( { value, onChange, ...props } ) {
  return (
    <Select defaultValue={ value } onValueChange={ onChange } { ...props }>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select display mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="casual">Casual</SelectItem>
        <SelectItem value="classic">Classic</SelectItem>
      </SelectContent>
    </Select>
  );
}
