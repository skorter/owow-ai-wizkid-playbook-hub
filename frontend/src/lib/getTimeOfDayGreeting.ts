export type TimeOfDayGreeting = "Good morning" | "Good afternoon" | "Good evening";

export function getTimeOfDayGreeting(date = new Date()): TimeOfDayGreeting {
  const hours = date.getHours();

  if (hours >= 5 && hours <= 11) {
    return "Good morning";
  }

  if (hours >= 12 && hours <= 16) {
    return "Good afternoon";
  }

  return "Good evening";
}
