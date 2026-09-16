import { cookies } from "next/headers";
import {
  parseUiLocale,
  UI_LOCALE_COOKIE,
  type UiLocale,
} from "./constants";
import { getDictionary, type Messages } from "./get-dictionary";

export async function getServerUiLocale(): Promise<UiLocale> {
  const jar = await cookies();
  return parseUiLocale(jar.get(UI_LOCALE_COOKIE)?.value);
}

export async function getServerDictionary(): Promise<{
  locale: UiLocale;
  dict: Messages;
}> {
  const locale = await getServerUiLocale();
  return { locale, dict: getDictionary(locale) };
}
