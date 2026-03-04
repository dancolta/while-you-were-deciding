import type { CrewData } from "@/lib/types";

interface ExpeditionEntry {
  expedition: number;
  start: string;
  end: string;
  crew_count: number;
  notable_member: string;
  crew_names: string[];
}

const EXPEDITIONS: ExpeditionEntry[] = [
  {
    expedition: 62,
    start: "2020-02-06",
    end: "2020-04-17",
    crew_count: 3,
    notable_member: "Andrew Morgan",
    crew_names: ["Oleg Skripochka", "Andrew Morgan", "Jessica Meir"],
  },
  {
    expedition: 63,
    start: "2020-04-17",
    end: "2020-10-21",
    crew_count: 6,
    notable_member: "Chris Cassidy",
    crew_names: [
      "Chris Cassidy",
      "Anatoli Ivanishin",
      "Ivan Vagner",
      "Doug Hurley",
      "Bob Behnken",
    ],
  },
  {
    expedition: 64,
    start: "2020-10-21",
    end: "2021-04-17",
    crew_count: 7,
    notable_member: "Kate Rubins",
    crew_names: [
      "Sergey Ryzhikov",
      "Sergey Kud-Sverchkov",
      "Kate Rubins",
      "Michael Hopkins",
      "Victor Glover",
      "Shannon Walker",
      "Soichi Noguchi",
    ],
  },
  {
    expedition: 65,
    start: "2021-04-17",
    end: "2021-10-17",
    crew_count: 7,
    notable_member: "Thomas Pesquet",
    crew_names: [
      "Oleg Novitskiy",
      "Pyotr Dubrov",
      "Mark Vande Hei",
      "Shane Kimbrough",
      "Megan McArthur",
      "Thomas Pesquet",
      "Akihiko Hoshide",
    ],
  },
  {
    expedition: 66,
    start: "2021-10-17",
    end: "2022-03-30",
    crew_count: 7,
    notable_member: "Raja Chari",
    crew_names: [
      "Anton Shkaplerov",
      "Pyotr Dubrov",
      "Mark Vande Hei",
      "Raja Chari",
      "Thomas Marshburn",
      "Kayla Barron",
      "Matthias Maurer",
    ],
  },
  {
    expedition: 67,
    start: "2022-03-30",
    end: "2022-09-29",
    crew_count: 7,
    notable_member: "Samantha Cristoforetti",
    crew_names: [
      "Oleg Artemyev",
      "Denis Matveev",
      "Sergey Korsakov",
      "Kjell Lindgren",
      "Bob Hines",
      "Samantha Cristoforetti",
      "Jessica Watkins",
    ],
  },
  {
    expedition: 68,
    start: "2022-09-29",
    end: "2023-03-27",
    crew_count: 7,
    notable_member: "Nicole Mann",
    crew_names: [
      "Sergey Prokopyev",
      "Dmitri Petelin",
      "Frank Rubio",
      "Nicole Mann",
      "Josh Cassada",
      "Koichi Wakata",
      "Anna Kikina",
    ],
  },
  {
    expedition: 69,
    start: "2023-03-27",
    end: "2023-09-27",
    crew_count: 7,
    notable_member: "Frank Rubio",
    crew_names: [
      "Sergey Prokopyev",
      "Dmitri Petelin",
      "Frank Rubio",
      "Stephen Bowen",
      "Warren Hoburg",
      "Sultan Alneyadi",
      "Andrey Fedyaev",
    ],
  },
  {
    expedition: 70,
    start: "2023-09-27",
    end: "2024-04-06",
    crew_count: 7,
    notable_member: "Jasmin Moghbeli",
    crew_names: [
      "Oleg Kononenko",
      "Nikolai Chub",
      "Konstantin Borisov",
      "Jasmin Moghbeli",
      "Andreas Mogensen",
      "Satoshi Furukawa",
      "Loral O'Hara",
    ],
  },
  {
    expedition: 71,
    start: "2024-04-06",
    end: "2024-09-24",
    crew_count: 7,
    notable_member: "Tracy Dyson",
    crew_names: [
      "Oleg Kononenko",
      "Nikolai Chub",
      "Tracy Dyson",
      "Matthew Dominick",
      "Michael Barratt",
      "Jeanette Epps",
      "Alexander Grebenkin",
    ],
  },
  {
    expedition: 72,
    start: "2024-09-24",
    end: "2025-04-01",
    crew_count: 9,
    notable_member: "Sunita Williams",
    crew_names: [
      "Alexei Ovchinin",
      "Ivan Vagner",
      "Donald Pettit",
      "Sunita Williams",
      "Butch Wilmore",
      "Nick Hague",
      "Aleksandr Gorbunov",
    ],
  },
  {
    expedition: 73,
    start: "2025-04-01",
    end: "2026-04-01",
    crew_count: 7,
    notable_member: "Anne McClain",
    crew_names: [
      "Alexei Ovchinin",
      "Ivan Vagner",
      "Sunita Williams",
      "Butch Wilmore",
      "Anne McClain",
      "Takuya Onishi",
      "Kirill Peskov",
    ],
  },
];

export function getCrewForDate(dateStr: string): CrewData | null {
  const target = new Date(dateStr + "T12:00:00Z").getTime();

  for (const exp of EXPEDITIONS) {
    const start = new Date(exp.start + "T00:00:00Z").getTime();
    const end = new Date(exp.end + "T23:59:59Z").getTime();
    if (target >= start && target <= end) {
      return {
        expedition: exp.expedition,
        crew_count: exp.crew_count,
        notable_member: exp.notable_member,
        crew_names: exp.crew_names,
      };
    }
  }

  return null;
}
