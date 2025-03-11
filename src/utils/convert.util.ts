export function convertDecimalToTime(decimalDuration: number) {
  const hours = Math.floor(decimalDuration);
  const minutes = Math.round((decimalDuration - hours) * 60);
  return { hours, minutes };
}

export function convertDateToString(date: Date) {
  return date.toISOString().split('T')[0];
}
