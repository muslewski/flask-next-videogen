export function formatTime(seconds: number) {
  if (typeof seconds !== "number" || isNaN(seconds)) {
    throw new Error("Input must be a valid number");
  }

  const totalSeconds = Math.floor(seconds); // Ignore decimals for HH:MM:SS
  const fractionalSeconds = seconds - totalSeconds;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  // Pad with leading zeros
  const pad = (num: number) => String(num).padStart(2, "0");

  // Add fractional part for sub-second precision if applicable
  const formatSeconds =
    fractionalSeconds > 0
      ? `${pad(secs)}.${Math.round(fractionalSeconds * 100)}`
      : pad(secs);

  if (hours > 0) {
    return `${pad(hours)}h ${pad(minutes)}m ${pad(secs)}s`;
  } else if (minutes > 0) {
    return `${pad(minutes)}m ${pad(secs)}s`;
  } else {
    return `${formatSeconds}s`;
  }
}
