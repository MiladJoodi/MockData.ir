/** Human remaining time until expiresAt ISO string. */
export function formatExpiresIn(
  expiresAt: string,
  locale: "en" | "fa",
): { expired: boolean; label: string; shortLabel: string } {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) {
    return {
      expired: true,
      label: locale === "fa" ? "منقضی شده" : "Expired",
      shortLabel: locale === "fa" ? "منقضی" : "Expired",
    };
  }

  const minutes = Math.floor(ms / 60_000);
  const hours = Math.floor(ms / 3_600_000);
  const days = Math.floor(ms / 86_400_000);

  if (locale === "fa") {
    const n = (value: number) => value.toLocaleString("fa-IR");
    if (days >= 1) {
      return {
        expired: false,
        label: days === 1 ? "تا ۱ روز دیگر" : `تا ${n(days)} روز دیگر`,
        shortLabel: `${n(days)} روز`,
      };
    }
    if (hours >= 1) {
      return {
        expired: false,
        label: hours === 1 ? "تا ۱ ساعت دیگر" : `تا ${n(hours)} ساعت دیگر`,
        shortLabel: `${n(hours)} ساعت`,
      };
    }
    const m = Math.max(1, minutes);
    return {
      expired: false,
      label: m === 1 ? "تا ۱ دقیقه دیگر" : `تا ${n(m)} دقیقه دیگر`,
      shortLabel: `${n(m)} دقیقه`,
    };
  }

  if (days >= 1) {
    return {
      expired: false,
      label: days === 1 ? "Valid for 1 more day" : `Valid for ${days} more days`,
      shortLabel: days === 1 ? "1d" : `${days}d`,
    };
  }
  if (hours >= 1) {
    return {
      expired: false,
      label:
        hours === 1 ? "Valid for 1 more hour" : `Valid for ${hours} more hours`,
      shortLabel: hours === 1 ? "1h" : `${hours}h`,
    };
  }
  const m = Math.max(1, minutes);
  return {
    expired: false,
    label:
      m === 1 ? "Valid for 1 more minute" : `Valid for ${m} more minutes`,
    shortLabel: m === 1 ? "1m" : `${m}m`,
  };
}
