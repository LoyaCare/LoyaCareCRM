export const formatDate = (date: Date | string, locale: string = "de-De"): string => {
  const formatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  try {
    return formatter.format(new Date(date)).replace(/\./g, ".");
  } catch (error) {
    console.error("Error formatting date:", error);
    return date.toLocaleString();
  }
}
