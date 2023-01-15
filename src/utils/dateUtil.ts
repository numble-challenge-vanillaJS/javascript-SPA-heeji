export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('kr').format(date);
}
