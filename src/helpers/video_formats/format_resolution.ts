export function formatResolution(height?: number): string {
  if (!height) return '';

  if (height >= 4320) return "8K";
  if (height >= 2160) return "4K";
  if (height >= 1440) return "2K";
  if (height >= 1080) return "Full HD";
  if (height >= 720) return "HD";
  if (height >= 540) return '540p';
  if (height >= 480) return '480p';
  if (height >= 360) return '360p';

  return `${height}p`;
}