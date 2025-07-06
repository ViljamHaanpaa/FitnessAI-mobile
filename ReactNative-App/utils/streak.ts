export function getStreak(
  completedWorkouts: { completedAt: string }[]
): number {
  const days = Array.from(
    new Set(
      completedWorkouts.map((w) =>
        new Date(w.completedAt).toISOString().slice(0, 10)
      )
    )
  ).sort((a, b) => (a < b ? 1 : -1)); // sort descending

  if (days.length === 0) return 0;

  let streak = 0;
  let current = new Date();
  for (let i = 0; i < days.length; i++) {
    const day = new Date(days[i]);
    if (
      day.getUTCFullYear() === current.getUTCFullYear() &&
      day.getUTCMonth() === current.getUTCMonth() &&
      day.getUTCDate() === current.getUTCDate()
    ) {
      streak++;
      current.setUTCDate(current.getUTCDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
