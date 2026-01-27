// Region 옵션
export const REGIONS = [
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Africa",
    "Oceania",
  ] as const;
  
  // City 옵션 (Region별)
  export const CITIES: Record<string, string[]> = {
    "Asia": ["Seoul", "Tokyo", "Bangkok", "Singapore", "Hong Kong", "Bali"],
    "Europe": ["Paris", "London", "Rome", "Barcelona", "Amsterdam", "Berlin"],
    "North America": ["New York", "Los Angeles", "Toronto", "Vancouver", "Mexico City"],
    "South America": ["Rio de Janeiro", "Buenos Aires", "Lima", "Santiago"],
    "Africa": ["Cairo", "Cape Town", "Marrakech", "Nairobi"],
    "Oceania": ["Sydney", "Melbourne", "Auckland", "Wellington"],
  };
  
  // Theme 옵션
  export const THEMES = [
    "Culture & History",
    "Nature & Adventure",
    "Food & Dining",
    "Shopping",
    "Relaxation",
    "Nightlife",
    "Family Friendly",
    "Romantic",
  ] as const;
  
  // Sub-Theme 옵션 (Theme별)
  export const SUB_THEMES: Record<string, string[]> = {
    "Culture & History": ["Museums", "Temples", "Historical Sites", "Art Galleries"],
    "Nature & Adventure": ["Hiking", "Beaches", "Mountains", "Water Sports"],
    "Food & Dining": ["Local Cuisine", "Street Food", "Fine Dining", "Cafes"],
    "Shopping": ["Markets", "Malls", "Boutiques", "Souvenirs"],
    "Relaxation": ["Spas", "Hot Springs", "Beaches", "Yoga"],
    "Nightlife": ["Bars", "Clubs", "Live Music", "Rooftops"],
    "Family Friendly": ["Theme Parks", "Zoos", "Museums", "Parks"],
    "Romantic": ["Sunset Spots", "Fine Dining", "Scenic Views", "Couples Activities"],
  };
  
  // Season 옵션
  export const SEASONS = [
    "Spring",
    "Summer",
    "Fall",
    "Winter",
    "Any",
  ] as const;
  
  // Group size 옵션
  export const GROUP_SIZES = [
    "Solo",
    "Couple (2)",
    "Small Group (3-5)",
    "Medium Group (6-10)",
    "Large Group (10+)",
  ] as const;
  
  // Walking level 옵션
  export const WALKING_LEVELS = [
    "Easy",
    "Moderate",
    "Challenging",
    "Any",
  ] as const;