import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { THEMES, SUB_THEMES, SEASONS, GROUP_SIZES, WALKING_LEVELS } from "~/lib/travel-option";

interface FilterData {
  theme: string;
  subTheme: string;
  season: string;
  groupSize: string;
  walkingLevel: string;
}

interface FilterBarProps {
  initialFilters?: Partial<FilterData>;
  onFilterChange?: (filters: FilterData) => void;
}

export function FilterBar({ initialFilters = {}, onFilterChange }: FilterBarProps) {
  const [filterData, setFilterData] = useState<FilterData>({
    theme: initialFilters.theme || "",
    subTheme: initialFilters.subTheme || "",
    season: initialFilters.season || "",
    groupSize: initialFilters.groupSize || "",
    walkingLevel: initialFilters.walkingLevel || "",
});

const handleFilterChange = (field: keyof FilterData, value: string) => {
  setFilterData((prev) => {
    const newData = { ...prev, [field]: value };
    if (field === "theme") {
      newData.subTheme = "";
    }
    onFilterChange?.(newData);
    return newData;
  });
};

const availableSubThemes = filterData.theme ? (SUB_THEMES[filterData.theme] || []) : [];

  return (
    <div className="pt-20 pb-4 px-20 bg-background border-b">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">Filters:</span>
        
        {/* Theme */}
        <Select
          value={filterData.theme}
          onValueChange={(value) => handleFilterChange("theme", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {THEMES.map((theme) => (
              <SelectItem key={theme} value={theme}>
                {theme}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sub-Theme */}
        <Select
          value={filterData.subTheme}
          onValueChange={(value) => handleFilterChange("subTheme", value)}
          disabled={!filterData.theme}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sub-Theme" />
          </SelectTrigger>
          <SelectContent>
            {availableSubThemes.map((subTheme) => (
              <SelectItem key={subTheme} value={subTheme}>
                {subTheme}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Season */}
        <Select
          value={filterData.season}
          onValueChange={(value) => handleFilterChange("season", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Season" />
          </SelectTrigger>
          <SelectContent>
            {SEASONS.map((season) => (
              <SelectItem key={season} value={season}>
                {season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Group size */}
        <Select
          value={filterData.groupSize}
          onValueChange={(value) => handleFilterChange("groupSize", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Group size" />
          </SelectTrigger>
          <SelectContent>
            {GROUP_SIZES.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Walking level */}
        <Select
          value={filterData.walkingLevel}
          onValueChange={(value) => handleFilterChange("walkingLevel", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Walking level" />
          </SelectTrigger>
          <SelectContent>
            {WALKING_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}