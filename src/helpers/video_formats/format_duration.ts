export function formatDuration(totalSeconds: number): string {
  const total = Math.round(totalSeconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  const pad = (value: number) => String(value).padStart(2, '0');

  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`; 
  }
  return `${m}:${pad(s)}`;
}