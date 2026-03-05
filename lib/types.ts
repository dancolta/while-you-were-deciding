export type DatePrecision = "exact" | "month" | "year";

export interface BriefingRequest {
  date: string;
  precision: DatePrecision;
  decision?: string;
  label?: string;
  reason?: string;
}

export interface WikipediaEvent {
  year: number;
  text: string;
}

export interface EarthquakeData {
  magnitude: number;
  location: string;
  distance_description: string;
}

export interface AsteroidData {
  name: string;
  size_comparison: string;
  speed_mph: string;
  distance_comparison: string;
}

export interface ISSData {
  latitude: number;
  longitude: number;
  location_name: string;
  is_current: true;
}

export interface CrewData {
  expedition: number;
  crew_count: number;
  notable_member: string;
  crew_names: string[];
}

export interface DemographicsData {
  births_per_day: number;
  deaths_per_day: number;
  framed: string;
}

export interface SunData {
  sunrise: string;
  sunset: string;
  day_length_hours: number;
  day_length_formatted: string;
  location_name: string;
}

export interface NumberFact {
  day_of_year: number;
  total_days: number;
  percent_through: number;
  moon_phase: string;
  moon_emoji: string;
  zodiac: string;
}

export interface NasaApod {
  title: string;
  explanation: string;
  url: string;
}

export interface BriefingData {
  date: string;
  precision: DatePrecision;
  decision?: string;
  label?: string;
  reason?: string;
  wikipedia: WikipediaEvent[];
  earthquake: EarthquakeData | null;
  asteroid: AsteroidData | null;
  iss: ISSData | null;
  crew: CrewData | null;
  demographics: DemographicsData;
  sun: SunData | null;
  number_fact: NumberFact | null;
  nasa_apod: NasaApod | null;
  closing_line: string;
  meanwhile_line: string;
  perspective_line: string;
  briefing_number: number;
}

export interface BriefingShareData {
  hash: string;
  date: string;
  decision?: string;
  label?: string;
  wikipedia: WikipediaEvent[];
  earthquake: EarthquakeData | null;
  asteroid: AsteroidData | null;
  iss: ISSData | null;
  crew: CrewData | null;
  demographics: DemographicsData;
  closing_line: string;
  perspective_line: string;
  briefing_number: number;
}
