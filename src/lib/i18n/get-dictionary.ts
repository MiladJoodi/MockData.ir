import type { UiLocale } from "./constants";
import { parseUiLocale } from "./constants";
import type { Messages } from "./messages/en";
import { en } from "./messages/en";
import { fa } from "./messages/fa";

const catalogs: Record<UiLocale, Messages> = { en, fa };

export function getDictionary(locale: UiLocale): Messages {
  return catalogs[locale] ?? fa;
}

export function getDictionaryFromValue(
  value: string | null | undefined,
): Messages {
  return getDictionary(parseUiLocale(value));
}

export type { Messages };
