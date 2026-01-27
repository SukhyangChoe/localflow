import { useState } from "react";
import { Button } from "~/common/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/common/components/ui/select";
import { CalendarIcon, Search, Sparkles } from "lucide-react";
import { type MetaFunction, useNavigate } from "react-router";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/common/components/ui/dialog";
import { Calendar } from "~/common/components/ui/calendar";
import { REGIONS, CITIES, THEMES, SUB_THEMES, SEASONS, GROUP_SIZES, WALKING_LEVELS } from "~/lib/travel-option";

export const meta: MetaFunction = () => {
  return [
    { title: "LOCALFLOW - Select Search" },
    { name: "description", content: "Select your travel preferences" },
  ];
};

export default function SelectHomePage() {
  const [formData, setFormData] = useState({
    region: "Asia",
    city: "Seoul",
    theme: "",
    subTheme: "",
    season: "",
    groupSize: "",
    walkingLevel: "",
    travelDates: "",
  });

  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const navigate = useNavigate();

  const availableCities = formData.region ? (CITIES[formData.region] || []) : [];
  const availableSubThemes = formData.theme ? (SUB_THEMES[formData.theme] || []) : [];

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      // Region이 변경되면 City 초기화
      if (field === "region") {
        newData.city = "";
      }
      // Theme이 변경되면 Sub-Theme 초기화
      if (field === "theme") {
        newData.subTheme = "";
      }
      return newData;
    });
  };

  const handleQuickSelect = (days: number) => {
    if (!startDate) return;
    const end = new Date(startDate);
    end.setDate(end.getDate() + days);
    setEndDate(end);
  };

  const handleConfirmDates = () => {
    if (startDate && endDate) {
      const formatted = `${format(startDate, "MMM dd, yyyy")} - ${format(endDate, "MMM dd, yyyy")}`;
      setFormData((prev) => ({ ...prev, travelDates: formatted }));
      setIsDateModalOpen(false);
    }
  };

  const handleSearch = () => {
    // Region과 City 필수 검증
    if (!formData.region || !formData.city) {
        alert("Region and City are required.");
        return;
    }
    // Search 페이지로 데이터 전달
    navigate("/board/search", {
        state: formData,
    });
    console.log("Search with:", formData);
    // 검색 로직 추가
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-semibold text-center mb-12">
          What is your dream trip?
        </h1>
        
        <div className="border rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Region - 필수 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Region <span className="text-destructive">*</span>
              </label>
              <Select
                value={formData.region}
                onValueChange={(value) => handleSelectChange("region", value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City - 필수 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                City <span className="text-destructive">*</span>
              </label>
              <Select
                value={formData.city}
                onValueChange={(value) => handleSelectChange("city", value)}
                disabled={!formData.region}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={formData.region ? "Select city" : "Select region first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Theme */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <Select
                value={formData.theme}
                onValueChange={(value) => handleSelectChange("theme", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {THEMES.map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      {theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub-Theme */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sub-Theme</label>
              <Select
                value={formData.subTheme}
                onValueChange={(value) => handleSelectChange("subTheme", value)}
                disabled={!formData.theme}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={formData.theme ? "Select sub-theme" : "Select theme first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableSubThemes.map((subTheme) => (
                    <SelectItem key={subTheme} value={subTheme}>
                      {subTheme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Season */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Season</label>
              <Select
                value={formData.season}
                onValueChange={(value) => handleSelectChange("season", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {SEASONS.map((season) => (
                    <SelectItem key={season} value={season}>
                      {season}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Group size */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Group size</label>
              <Select
                value={formData.groupSize}
                onValueChange={(value) => handleSelectChange("groupSize", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select group size" />
                </SelectTrigger>
                <SelectContent>
                  {GROUP_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Walking level */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Walking level</label>
              <Select
                value={formData.walkingLevel}
                onValueChange={(value) => handleSelectChange("walkingLevel", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select walking level" />
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

            {/* Travel dates */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Travel dates</label>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={() => setIsDateModalOpen(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.travelDates || "Select travel dates"}
              </Button>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center pt-4">
            <Button onClick={handleSearch} size="lg" className="px-8 cursor-pointer">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Travel Dates Modal */}
      <Dialog open={isDateModalOpen} onOpenChange={setIsDateModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Select Travel Dates</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* 두 개의 달력 */}
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => {
                    if (!startDate) return false;
                    return date < startDate;
                  }}
                  className="rounded-md border"
                />
              </div>
            </div>

            {/* Quick select buttons */}
            <div className="flex gap-3 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickSelect(7)}
                disabled={!startDate}
              >
                1 Week
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickSelect(14)}
                disabled={!startDate}
              >
                14 Days
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleQuickSelect(30)}
                disabled={!startDate}
              >
                1 Month
              </Button>
            </div>

            {/* Confirm button */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirmDates}
                disabled={!startDate || !endDate}
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}