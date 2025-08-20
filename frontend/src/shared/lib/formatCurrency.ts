export const currencyFormatter = (
  value: any,
  currency: string = "EUR",
  locale: string = "de-DE"
) =>
  value
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        currencyDisplay: "symbol",
      }).format(value)
    : null;
