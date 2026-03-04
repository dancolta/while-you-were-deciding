import type { DemographicsData } from "@/lib/types";

const BIRTHS_PER_DAY = 385000;
const DEATHS_PER_DAY = 165000;

export function getDemographics(): DemographicsData {
  return {
    births_per_day: BIRTHS_PER_DAY,
    deaths_per_day: DEATHS_PER_DAY,
    framed: `${BIRTHS_PER_DAY.toLocaleString("en-US")} people were born. ${DEATHS_PER_DAY.toLocaleString("en-US")} people died.`,
  };
}
