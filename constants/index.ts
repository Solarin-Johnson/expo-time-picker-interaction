export const SPRING_CONFIG = {
  damping: 40,
  stiffness: 300,
};
export const SPRING_CONFIG_BOUNCE = {
  damping: 19,
  stiffness: 170,
};

export const MINUTES = Array.from({ length: 48 }, (_, i) => (i * 30) % 1440);

export function minutesTo12HourFormat(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = mins.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes} ${period}`;
}
