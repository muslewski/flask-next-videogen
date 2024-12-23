export function formatTime(seconds: number) {
  if (typeof seconds !== "number" || isNaN(seconds)) {
    throw new Error("Input must be a valid number");
  }

  const totalSeconds = Math.floor(seconds); // Ignore decimals for HH:MM:SS

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  // Pad with leading zeros
  const pad = (num: number) => String(num).padStart(2, "0");

  if (hours > 0) {
    return `${pad(hours)}h ${pad(minutes)}m ${pad(secs)}s`;
  } else if (minutes > 0) {
    return `${pad(minutes)}m ${pad(secs)}s`;
  } else {
    return `${pad(secs)}s`;
  }
}
