export function convertDecimalToTime(decimalDuration: number) {
  const hours = Math.floor(decimalDuration);
  const minutes = Math.round((decimalDuration - hours) * 60);
  return { hours, minutes };
}
