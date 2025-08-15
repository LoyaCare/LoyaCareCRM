export const formatDate = (date: Date | string, locale: string = "de-De") => {
  const formatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
return formatter.format(new Date(date)).replace(/\./g, ".");
}
