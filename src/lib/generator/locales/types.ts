export type GeneratorCountryCode =
  | "IR"
  | "DE"
  | "US"
  | "GB"
  | "FR"
  | "NL"
  | "JP"
  | "CA";

export type LocalePlace = {
  city: string;
  region: string;
};

export type LocalePack = {
  code: GeneratorCountryCode;
  countryName: string;
  currency: string;
  currencySymbol: string;
  regionLabel: "province" | "state" | "region";
  firstNames: string[];
  lastNames: string[];
  places: LocalePlace[];
  streets: string[];
  phonePrefix: string;
  postalPattern: "ir" | "de" | "us" | "gb" | "fr" | "nl" | "jp" | "ca";
  companies: string[];
  industries: string[];
};
