export const formatDate = (date: Date | string, locale: string = "de-De") =>
  new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
