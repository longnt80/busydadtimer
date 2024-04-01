export type Levels = "1a" | "1b" | "1c" | "1d" | "2" | "3" | "4";
export type Movements = "6-count" | "10-count";

export const levelsMapping = {
  "1a": {
    "6-count": 1,
    "10-count": 1,
  },
  "1b": {
    "6-count": 50,
    "10-count": 20,
  },
  "1c": {
    "6-count": 100,
    "10-count": 40,
  },
  "1d": {
    "6-count": 150,
    "10-count": 60,
  },
  "2": {
    "6-count": 200,
    "10-count": 80,
  },
  "3": {
    "6-count": 250,
    "10-count": 100,
  },
  "4": {
    "6-count": 275,
    "10-count": 120,
  },
};

export function isValidLevel(level: FormDataEntryValue): level is Levels {
  return Object.keys(levelsMapping).includes(level as string);
}

export function isValidMovement(movement: FormDataEntryValue): movement is Movements {
  return ["6-count", "10-count"].includes(movement as string);
}
