const STATE_TO_COUNTRY: Record<string, string> = {
  AL: "US",
  AK: "US",
  AZ: "US",
  AR: "US",
  CA: "US",
  CO: "US",
  CT: "US",
  DE: "US",
  FL: "US",
  GA: "US",
  HI: "US",
  ID: "US",
  IL: "US",
  IN: "US",
  IA: "US",
  KS: "US",
  KY: "US",
  LA: "US",
  ME: "US",
  MD: "US",
  MA: "US",
  MI: "US",
  MN: "US",
  MS: "US",
  MO: "US",
  MT: "US",
  NE: "US",
  NV: "US",
  NH: "US",
  NJ: "US",
  NM: "US",
  NY: "US",
  NC: "US",
  ND: "US",
  OH: "US",
  OK: "US",
  OR: "US",
  PA: "US",
  RI: "US",
  SC: "US",
  SD: "US",
  TN: "US",
  TX: "US",
  UT: "US",
  VT: "US",
  VA: "US",
  WA: "US",
  WV: "US",
  WI: "US",
  WY: "US",
  ON: "CA",
  QC: "CA",
  BC: "CA",
  AB: "CA",
  MB: "CA",
  SK: "CA",
  NS: "CA",
  NB: "CA",
  NL: "CA",
  PE: "CA",
  NT: "CA",
  YT: "CA",
  NU: "CA",
};

const COUNTRY_CODES: Record<string, string> = {
  "United States": "US",
  USA: "US",
  "United States of America": "US",
  Canada: "CA",
  "United Kingdom": "GB",
  UK: "GB",
  Australia: "AU",
  Germany: "DE",
  France: "FR",
  India: "IN",
  Japan: "JP",
  China: "CN",
  Brazil: "BR",
  Mexico: "MX",
  Spain: "ES",
  Italy: "IT",
  Netherlands: "NL",
  Sweden: "SE",
  Switzerland: "CH",
  Singapore: "SG",
};

export function extractCountryFromLocation(location: string): string | null {
  if (!location || location.toLowerCase() === "remote") return null;

  const parts = location.split(",").map((p) => p.trim());

  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1].toUpperCase();
    if (STATE_TO_COUNTRY[lastPart]) {
      return STATE_TO_COUNTRY[lastPart];
    }
  }

  const locationUpper = location.toUpperCase();
  for (const [country, code] of Object.entries(COUNTRY_CODES)) {
    if (locationUpper.includes(country.toUpperCase())) {
      return code;
    }
  }

  return null;
}

export function matchesLocation(
  jobLocation: string,
  filterLocation: string,
): boolean {
  if (
    !filterLocation ||
    filterLocation === "" ||
    filterLocation.toLowerCase() === "any location"
  ) {
    return true;
  }

  if (filterLocation.toLowerCase() === "remote") {
    return jobLocation.toLowerCase() === "remote";
  }

  const jobLower = jobLocation.toLowerCase();
  const filterLower = filterLocation.toLowerCase();

  if (jobLower.includes(filterLower)) {
    return true;
  }

  const jobCountry = extractCountryFromLocation(jobLocation);

  const filterCountryCode = COUNTRY_CODES[filterLocation];
  if (filterCountryCode && jobCountry) {
    return jobCountry === filterCountryCode;
  }

  return false;
}
