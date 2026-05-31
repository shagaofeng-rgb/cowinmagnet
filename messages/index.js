import en from "./en";
import es from "./es";
import ru from "./ru";
import ar from "./ar";
import fr from "./fr";
import pt from "./pt";
import { defaultLocale, isLocale } from "@/data/i18n";

const dictionaries = { en, es, ru, ar, fr, pt };

export function getMessages(locale = defaultLocale) {
  return dictionaries[isLocale(locale) ? locale : defaultLocale];
}
