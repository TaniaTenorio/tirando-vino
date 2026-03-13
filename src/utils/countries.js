import { CountryRegionData as rawCountryRegionData } from "react-country-region-selector";

const countryRegionData = Array.isArray(rawCountryRegionData)
  ? rawCountryRegionData
  : rawCountryRegionData?.default || [];

const spanishDisplayNames = new Intl.DisplayNames(["es"], { type: "region" });

const normalizeCountryValue = (value) =>
  (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

export const getSpanishCountryNameFromCode = (countryCode) => {
  if (!countryCode) return "";

  return spanishDisplayNames.of(countryCode.toUpperCase()) || countryCode;
};

export const getCountryCodeFromValue = (countryValue) => {
  if (!countryValue) return "";

  const normalizedValue = normalizeCountryValue(countryValue);

  const match = countryRegionData.find(([englishName, countryCode]) => {
    const spanishName = getSpanishCountryNameFromCode(countryCode);

    return (
      normalizeCountryValue(countryCode) === normalizedValue ||
      normalizeCountryValue(englishName) === normalizedValue ||
      normalizeCountryValue(spanishName) === normalizedValue
    );
  });

  return match?.[1] || "";
};

export const getCountryDisplayValue = (countryValue) => {
  const countryCode = getCountryCodeFromValue(countryValue);

  if (!countryCode) return countryValue || "";
  return getSpanishCountryNameFromCode(countryCode);
};
